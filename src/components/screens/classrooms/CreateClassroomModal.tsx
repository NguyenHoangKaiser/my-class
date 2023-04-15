import { useState } from "react";
import { EyeOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, message, Select, Space } from "antd";
import { Form, Input, Modal, Radio } from "antd";
import { trpc } from "src/utils/trpc";
import ReactMarkdown from "react-markdown";

type FormSubject = {
  name: string;
  description: string;
};

type CreateClassroomFormData = {
  name: string;
  description?: string;
  language?: string;
  subject: [];
  addSubjectCheck?: boolean;
  addSubject?: FormSubject[];
  password?: string;
  requirements?: string;
  modifier: "public" | "private";
};
interface CreateClassroomModalProp {
  open: boolean;
  onCancel: () => void;
  refetch: () => void;
}

const CreateClassroomModal: React.FC<CreateClassroomModalProp> = ({
  open,
  onCancel,
  refetch,
}) => {
  const [form] = Form.useForm<CreateClassroomFormData>();
  const { data: subjectData } = trpc.classroom.getSubjects.useQuery();
  const createClassroom = trpc.classroom.createClassroom.useMutation();
  const addSubjectCheckValue = Form.useWatch("addSubjectCheck", form);
  const modifierValue = Form.useWatch("modifier", form);
  const descriptionMD = Form.useWatch("description", form);
  const requirementsMD = Form.useWatch("requirements", form);

  const [showDescPreview, setShowDescPreview] = useState(false);
  const [showReqPreview, setShowReqPreview] = useState(false);

  const onFinish = async (
    values: CreateClassroomFormData,
    resetFields: () => void
  ) => {
    if (createClassroom.isLoading) {
      return;
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

      const formData = {
        name: values.name,
        description: values.description ?? "No description provided",
        language: values.language ?? "en",
        password: values.password ?? null,
        requirements: values.requirements ?? "No requirements provided",
        modifier: values.modifier,
        subject: subjectArr,
      };

      await createClassroom.mutateAsync(formData);
      message.success("Classroom created successfully");
      resetFields();
      onCancel();
      refetch();
    } catch (error) {
      message.error("Failed to create classroom");
    }
  };

  return (
    <Modal
      open={open}
      title="CREATE A NEW CLASSROOM"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onFinish(values, form.resetFields);
        });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="create-class"
        initialValues={{
          modifier: "public",
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
          tooltip="Markdown is supported. Click the eye icon to preview the description."
          label={
            <Space>
              <span>Description</span>
              <EyeOutlined
                onClick={() => setShowDescPreview(!showDescPreview)}
              />
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
          <Radio.Group>
            <Radio value="public">Public</Radio>
            <Radio value="private">Private</Radio>
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
          initialValue={{
            label: "English",
            value: "en",
          }}
          name="language"
          label="Language"
        >
          <Select
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
          tooltip="Markdown is supported. Click the eye icon to preview the requirements."
          label={
            <Space>
              <span>Requirements</span>
              <EyeOutlined onClick={() => setShowReqPreview(!showReqPreview)} />
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
      </Form>
    </Modal>
  );
};

export default CreateClassroomModal;
