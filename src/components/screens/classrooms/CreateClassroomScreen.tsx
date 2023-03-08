import { MinusCircleOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Radio,
  Select,
} from "antd";
import { useRouter } from "next/router";
import { MainHeading } from "src/components/common";
import { trpc } from "src/utils/trpc";
type Subject = {
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
  addSubject?: Subject[];
  password?: string;
  requirements?: string;
  modifier: "public" | "private";
};

function CreateClassroomScreen() {
  const [form] = Form.useForm<CreateClassroomFormData>();
  const { data: subjectData } = trpc.classroom.getSubjects.useQuery();
  const createClassroom = trpc.classroom.createClassroom.useMutation();
  const addSubjectCheckValue = Form.useWatch("addSubjectCheck", form);
  const modifierValue = Form.useWatch("modifier", form);
  const router = useRouter();

  const onFinish = async (values: CreateClassroomFormData) => {
    console.log("Received values of form: ", values);
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

    const formData = {
      name: values.name,
      description: values.description ?? "No description provided",
      language: values.language?.value ?? "en",
      password: values.password ?? null,
      requirements: values.requirements ?? "No requirements provided",
      modifier: values.modifier,
      subject: subjectArr,
    };

    createClassroom.mutateAsync(formData, {
      onSuccess: () => {
        message.success("Classroom created successfully");
        form.resetFields();
        setTimeout(() => {
          router.push("/classrooms");
        }, 1000);
      },
      onError: (error) => {
        message.error("Failed to create classroom");
        console.log("Failed to create classroom", error);
      },
    });
    console.log("Form", formData);
  };
  return (
    <>
      <MainHeading title={"Create Classrooms"} />
      <Col span={10} offset={1}>
        <Form
          form={form}
          layout="vertical"
          name="create-class"
          onFinish={onFinish}
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
          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Description"
              showCount
              maxLength={200}
            />
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
              onChange={(value) => {
                console.log(value);
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
                        gap: 14,
                        paddingRight: 8,
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
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      // icon={<PlusOutlined />}
                    >
                      Add new subjects
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          )}
          <Form.Item name="requirements" label="Requirements">
            <Input.TextArea showCount maxLength={200} />
          </Form.Item>
          <Form.Item style={{ marginTop: 50 }}>
            <Button
              loading={createClassroom.isLoading}
              type="primary"
              htmlType="submit"
              size="large"
              block
            >
              Create Classroom
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </>
  );
}

export default CreateClassroomScreen;
