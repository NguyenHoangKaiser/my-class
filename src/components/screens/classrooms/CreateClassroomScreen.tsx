import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Form, Input, Radio, Select, Space } from "antd";
import { MainHeading } from "src/components/common";
import { trpc } from "src/utils/trpc";
type Subject = {
  name: string;
  description: string;
};

type CreateClassroomFormData = {
  name: string;
  description?: string;
  language?: string;
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
  const addSubject = trpc.classroom.addSubject.useMutation();
  const addSubjectCheckValue = Form.useWatch("addSubjectCheck", form);
  const modifierValue = Form.useWatch("modifier", form);
  const onFinish = async (values: CreateClassroomFormData) => {
    console.log(values.subject);

    // const formdata = {
    //   name: values.name,
    //   description: values.description,
    //   language: values.language,
    //   subject: values.subject.map((subject) => {
    //     return {
    //       name: subject.name,
    //       description: subject.description,
    //     };
    //   }),
    // }
    // if (values.addSubjectCheck && values.addSubject) {
    //   const addSubjectValues = values.addSubject.map((subject) => ({
    //     name: subject.name,
    //     description: subject.description,
    //   }));
    //   const addSubjectResult = await addSubject.mutateAsync(addSubjectValues);
    //   console.log(addSubjectResult);
    // }

    // const submit = await createClassroom.mutateAsync(values, {
    //   onSuccess: () => {
    //     console.log("success");
    //   },
    // });

    // createClassroom.mutateAsync(values);
  };
  return (
    <>
      <MainHeading title={"Create Classrooms"} />
      <Col span={10} offset={1}>
        <Form
          form={form}
          // labelAlign="left"
          layout="vertical"
          name="create-class"
          // requiredMark="optional"
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
            // style={{
            //   marginBottom: 0,
            // }}
            label="Subjects"
            name="subject"
            tooltip="The main subject of your class"
          >
            {/* <Space> */}
            {/* {!addSubjectCheckValue && ( */}
            {/* <Form.Item name="subject"> */}
            <Select
              // style={{ width: 400 }}
              mode="multiple"
              options={subjectData?.map((subject) => ({
                label: subject.name,
                value: subject.id,
              }))}
              placeholder="Please select classroom's subject"
            />
            {/* </Form.Item> */}
            {/* )} */}
            {/* </Space> */}
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
                      // span={18}
                      key={key}
                      style={{
                        display: "flex",
                        marginBottom: 8,
                        gap: 14,
                        // justifyContent: "space-between",
                        // alignItems: "center",
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
            <Button type="primary" htmlType="submit" size="large" block>
              Create Classroom
            </Button>
          </Form.Item>
        </Form>
      </Col>
      {/* </div> */}
    </>
  );
}

export default CreateClassroomScreen;
