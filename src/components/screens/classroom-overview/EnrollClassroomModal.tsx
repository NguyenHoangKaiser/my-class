import { message } from "antd";
import { Form, Input, Modal } from "antd";
import { trpc } from "src/utils/trpc";
import { useRouter } from "next/router";

type EnrollClassroomFormData = {
  password?: string;
};

interface EnrollClassroomModalProp {
  open: boolean;
  onCancel: () => void;
  refetch?: () => void;
  modifier: string;
  classroomName: string;
  classroomId: string;
}

const EnrollClassroomModal: React.FC<EnrollClassroomModalProp> = ({
  open,
  onCancel,
  modifier,
  classroomId,
  classroomName,
}) => {
  const [form] = Form.useForm<EnrollClassroomFormData>();
  const enrollMutation = trpc.classroom.enrollInClassroom.useMutation();
  const router = useRouter();
  const onFinish = async (
    values: EnrollClassroomFormData,
    resetFields: () => void
  ) => {
    await enrollMutation.mutateAsync(
      { classroomId, password: values.password },
      {
        onSuccess: () => {
          message.success("Enrolled in classroom");
          resetFields();
          onCancel();
          router.push(`/classrooms/${classroomId}`);
        },
        onError(error) {
          message.error(error?.message);
        },
      }
    );
  };

  return (
    <Modal
      open={open}
      title={`Enroll in ${modifier} class: ${classroomName}`}
      okText="Enroll"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onFinish(values, form.resetFields);
        });
      }}
    >
      <Form form={form} layout="vertical" name="enroll-classroom">
        <Form.Item
          tooltip="Only private classroom have password"
          name="password"
          label="Classroom password"
          rules={[
            {
              required: modifier === "private",
              message: "Please input the password of the classroom!",
            },
            {
              min: 6,
              message: "Password must be at least 6 characters",
            },
          ]}
        >
          <Input.Password
            disabled={modifier === "public"}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EnrollClassroomModal;
