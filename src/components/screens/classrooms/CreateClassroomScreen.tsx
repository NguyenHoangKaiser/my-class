import { Button, Form, Input } from "antd";
import { MainHeading } from "src/components/common";

function CreateClassroomScreen() {
  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };
  return (
    <>
      <MainHeading title={"Create Classrooms"} />
      {/* <div className="container ml-6 w-1/3"> */}
      <Form
        labelCol={{ span: 2, offset: 1 }}
        labelAlign="left"
        wrapperCol={{ span: 6 }}
        name="create-class"
        onFinish={onFinish}
      >
        <Form.Item
          label="Class Name"
          name="className"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input size="large" placeholder="Your class name" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.TextArea size="large" placeholder="Description" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 3, span: 6 }}>
          <Button type="primary" htmlType="submit" size="large" block>
            Create Classroom
          </Button>
        </Form.Item>
      </Form>
      {/* </div> */}
    </>
  );
}

export default CreateClassroomScreen;
