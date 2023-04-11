import { MinusCircleOutlined, UploadOutlined } from "@ant-design/icons";
import type { Classroom, Subject, User } from "@prisma/client";
import { Button, Checkbox, Col, message, Select, Upload } from "antd";
import { Form, Input, Modal, Radio } from "antd";
import useAntUpload from "src/hooks/useAntUpload";
import { trpc } from "src/utils/trpc";

type FormSubject = {
  name: string;
  description: string;
};

type CreateClassroomFormData = {
  name: string;
  description?: string;
  language?: {
    label: string;
    value: string;
  };
  subject: [];
  addSubjectCheck?: boolean;
  addSubject?: FormSubject[];
  password?: string;
  requirements?: string;
  modifier: "public" | "private";
  status: "active" | "inactive" | "archived";
};

interface EditClassroomModalProp {
  open: boolean;
  onCancel: () => void;
  refetch: () => void;
  classroom:
    | (Classroom & {
        students: User[];
        subjects: Subject[];
      })
    | null
    | undefined;
}

const EditClassroomModal: React.FC<EditClassroomModalProp> = ({
  open,
  onCancel,
  refetch,
  classroom,
}) => {
  const [form] = Form.useForm<CreateClassroomFormData>();
  const { data: subjectData } = trpc.classroom.getSubjects.useQuery();
  const editClassroom = trpc.classroom.editClassroom.useMutation();
  const addSubjectCheckValue = Form.useWatch("addSubjectCheck", form);
  const modifierValue = Form.useWatch("modifier", form);
  let disabled = false;
  if (classroom && classroom.students.length > 0) {
    disabled = true;
  }

  const { fileList, handleUpload, uploadProps, uploading } = useAntUpload({
    getUploadUrl: () => {
      return Promise.resolve(`avatars/classroom/${classroom?.id}`);
    },
    canUpdate: true,
    successMessage: "Classroom banner updated successfully!",
  });

  const onFinish = async (
    values: CreateClassroomFormData,
    resetFields: () => void
  ) => {
    let subjectArr: any[] = [];
    if (values.subject) {
      subjectArr = values.subject.map((subjectId) => {
        const arr = subjectData?.find((subject) => subject.id === subjectId);
        return {
          name: arr?.name,
          description: arr?.description,
        };
      });
    }
    if (values.addSubjectCheck && values.addSubject) {
      subjectArr = [...subjectArr, ...values.addSubject];
    }

    if (classroom && classroom.id) {
      const formData = {
        classroomId: classroom?.id,
        name: values.name,
        description: values.description ?? "No description provided",
        language: values.language?.value ?? "en",
        password: values.password ?? null,
        requirements: values.requirements ?? "No requirements provided",
        modifier: values.modifier,
        subject: subjectArr,
        status: values.status,
      };

      editClassroom.mutateAsync(formData, {
        onSuccess: () => {
          message.success("Classroom details updated successfully!");
          resetFields();
          refetch();
          onCancel();
        },
        onError: () => {
          message.error("Failed to update classroom details!");
        },
      });
    }
  };

  return (
    <Modal
      open={open}
      title="Edit classroom details"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onFinish(values, form.resetFields);
        });
        // .catch((info) => {
        //   console.log("Validate Failed:", info);
        // });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="edit-class"
        initialValues={{
          name: classroom?.name,
          description: classroom?.description,
          language: {
            label: classroom?.language === "en" ? "English" : "Vietnamese",
            value: classroom?.language,
          },
          subject: classroom?.subjects.map((subject) => subject.id),
          modifier: classroom?.modifier,
          status: classroom?.status,
          password: classroom?.password,
          requirements: classroom?.requirements,
        }}
      >
        <Form.Item
          name="name"
          label="Classroom name"
          rules={[
            {
              required: true,
              message: "Please input the name of the classroom!",
            },
          ]}
        >
          <Input placeholder="Classroom name" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Description" showCount maxLength={200} />
        </Form.Item>
        <Form.Item
          name="modifier"
          label="Modifier"
          tooltip={
            modifierValue === "private"
              ? "Private classroom can only be seen and enrolled by students who have the password."
              : "Public classroom can be seen and enrolled by any students."
          }
        >
          <Radio.Group disabled={disabled}>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Radio.Group>
            <Radio value="active">Active</Radio>
            <Radio value="inactive">Inactive</Radio>
            <Radio value="archived">Archived</Radio>
          </Radio.Group>
        </Form.Item>
        {modifierValue === "private" && (
          <Form.Item
            tooltip="Only private classroom can have password"
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input the password of the classroom!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters",
              },
            ]}
          >
            <Input.Password type="password" placeholder="Password" />
          </Form.Item>
        )}
        <Form.Item
          // initialValue={{
          //   label: "English",
          //   value: "en",
          // }}
          name="language"
          label="Language"
        >
          <Select
            disabled={disabled}
            options={[
              {
                label: "English",
                value: "en",
              },
              {
                label: "Vietnamese",
                value: "vi",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Subjects"
          name="subject"
          tooltip="The main subject of your class"
        >
          <Select
            disabled={disabled}
            mode="multiple"
            options={subjectData?.map((subject) => ({
              label: subject.name,
              value: subject.id,
            }))}
            placeholder="Please select classroom's subject"
          />
        </Form.Item>
        <Form.Item name="addSubjectCheck" valuePropName="checked">
          <Checkbox
            disabled={disabled}
            onChange={() => {
              form.setFieldsValue({
                addSubject: [
                  {
                    name: "",
                    description: "",
                  },
                ],
              });
            }}
          >
            Add new subject
          </Checkbox>
        </Form.Item>
        {addSubjectCheckValue && (
          <Form.List name="addSubject">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Col
                    key={key}
                    style={{
                      display: "flex",
                      marginBottom: 8,
                      gap: 8,
                    }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      style={{ flex: 0.8 }}
                      rules={[
                        { required: true, message: "Missing subject name" },
                      ]}
                    >
                      <Input style={{ flex: 1 }} placeholder="Subject Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      style={{ flex: 1 }}
                      name={[name, "description"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing subject description",
                        },
                      ]}
                    >
                      <Input.TextArea
                        showCount
                        maxLength={200}
                        placeholder="Subject description"
                      />
                    </Form.Item>
                    <MinusCircleOutlined
                      onClick={() => {
                        remove(name);
                        form.setFieldsValue({
                          addSubjectCheck: false,
                        });
                      }}
                    />
                  </Col>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add new subjects
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}
        <Form.Item
          style={{ marginBottom: 40 }}
          name="requirements"
          label="Requirements"
        >
          <Input.TextArea showCount maxLength={200} />
        </Form.Item>
      </Form>
      <div className="mb-8 flex items-start justify-between gap-4">
        <Upload {...uploadProps} maxCount={1} multiple={false}>
          <Button
            style={{ alignItems: "center", display: "flex" }}
            icon={<UploadOutlined />}
          >
            Select File
          </Button>
        </Upload>
        {fileList.length > 0 && (
          <Button type="primary" onClick={handleUpload} loading={uploading}>
            {uploading ? "Uploading" : "Start Upload"}
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default EditClassroomModal;
