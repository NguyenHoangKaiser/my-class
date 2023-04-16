import {
  EyeOutlined,
  MinusCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { Classroom, Subject, User } from "@prisma/client";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Tooltip,
  Upload,
} from "antd";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Banner } from "src/components/common";
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
  const descriptionMD = Form.useWatch("description", form);
  const requirementsMD = Form.useWatch("requirements", form);

  const [showDescPreview, setShowDescPreview] = React.useState(false);
  const [showReqPreview, setShowReqPreview] = React.useState(false);

  let disabled = false;
  if (classroom && classroom.students.length > 0) {
    disabled = true;
  }

  const { handleUpload, uploadProps, fileList } = useAntUpload({
    getUploadUrl: () => {
      return Promise.resolve(`avatars/classroom/${classroom?.id}`);
    },
    canUpdate: true,
    successMessage: "Classroom banner updated successfully!",
  });

  const onFinish = async (values: CreateClassroomFormData) => {
    console.log(values);
    if (editClassroom.isLoading) {
      return;
    }
    if (fileList.length > 0) {
      handleUpload();
    }
    try {
      const subjectArr: FormSubject[] = [];
      if (values.subject) {
        values.subject.forEach((subjectId) => {
          const arr = subjectData?.find((subject) => subject.id === subjectId);
          if (arr) {
            subjectArr.push(arr);
          }
        });
      }
      if (values.addSubjectCheck && values.addSubject) {
        subjectArr.push(...values.addSubject);
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

        await editClassroom.mutateAsync(formData);
        message.success("Classroom updated successfully!");
        refetch();
        onCancel();
      }
    } catch (error) {
      message.error("Failed to update classroom");
    }
  };

  return (
    <Modal
      open={open}
      title="EDIT CLASSROOM DETAILS"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onFinish(values);
        });
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
        <Form.Item
          name="description"
          label={
            <Space>
              <span>Description</span>
              <Tooltip title="Markdown is supported. Click the eye icon to preview the description.">
                <EyeOutlined
                  onClick={() => setShowDescPreview(!showDescPreview)}
                />
              </Tooltip>
            </Space>
          }
        >
          <Input.TextArea placeholder="Description" showCount maxLength={500} />
        </Form.Item>
        {showDescPreview && (
          <Form.Item name="descPreview" label="Description preview">
            <div className="rounded-md border border-gray-300 p-2">
              <ReactMarkdown>{`${descriptionMD}`}</ReactMarkdown>
            </div>
          </Form.Item>
        )}
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
          label={
            <Space>
              <span>Requirements</span>
              <Tooltip title="Markdown is supported. Click the eye icon to preview the Requirements.">
                <EyeOutlined
                  onClick={() => setShowReqPreview(!showReqPreview)}
                />
              </Tooltip>
            </Space>
          }
        >
          <Input.TextArea showCount maxLength={200} />
        </Form.Item>
        {showReqPreview && (
          <Form.Item name="reqPreview" label="Requirements preview">
            <div className="rounded-md border border-gray-300 p-2">
              <ReactMarkdown>{`${requirementsMD}`}</ReactMarkdown>
            </div>
          </Form.Item>
        )}
        <Form.Item name="banner" label="Class banner">
          <Banner
            width={"100%"}
            height={250}
            style={{ borderRadius: 8 }}
            classroomId={classroom?.id as string}
            alt="Classroom banner"
          />
          <div className="relative my-4 flex items-start justify-between gap-4">
            <Upload {...uploadProps} maxCount={1} multiple={false}>
              <Button
                style={{ alignItems: "center", display: "flex" }}
                icon={<UploadOutlined />}
              >
                Select File
              </Button>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditClassroomModal;
