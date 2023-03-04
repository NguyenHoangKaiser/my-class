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
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <Input size="large" placeholder="Username" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input size="large" type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 3, span: 6 }}>
          <Button type="primary" htmlType="submit" size="large" block>
            Log in
          </Button>
        </Form.Item>
      </Form>
      {/* </div> */}
    </>
  );
}

export default CreateClassroomScreen;
