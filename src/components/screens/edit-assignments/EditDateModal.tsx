import type { Assignment } from "@prisma/client";
import type { DatePickerProps } from "antd";
import { DatePicker, message } from "antd";
import { Form, Modal } from "antd";
import { trpc } from "src/utils/trpc";
import dayjs from "dayjs";

type EditAssignmentFormData = {
  dueDate: DatePickerProps["value"];
};

interface EditDateModalProp {
  open: boolean;
  onCancel: () => void;
  refetch: () => void;
  assignment: Assignment | null | undefined;
}

const EditDateModal: React.FC<EditDateModalProp> = ({
  open,
  onCancel,
  refetch,
  assignment,
}) => {
  const [form] = Form.useForm<EditAssignmentFormData>();
  const extendDueDate = trpc.assignment.updateDueDate.useMutation();

  const onFinish = async (
    values: EditAssignmentFormData,
    resetFields: () => void
  ) => {
    await extendDueDate.mutateAsync(
      {
        assignmentId: assignment?.id as string,
        dueDate: values["dueDate"]?.toISOString() as string,
      },
      {
        onSuccess: () => {
          message.success("Assignment extended successfully!");
          refetch();
          resetFields();
          onCancel();
        },
        onError: () => {
          message.error("Failed to extend assignment");
        },
      }
    );
  };

  const initialDueDate = dayjs(assignment?.dueDate);

  // eslint-disable-next-line arrow-body-style
  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs(assignment?.dueDate).add(1, "day");
  };

  return (
    <Modal
      open={open}
      title="Extend the due date of the assignment"
      okText="Save"
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
        name="extend-dueDate"
        initialValues={{
          dueDate: initialDueDate,
        }}
      >
        <Form.Item
          style={{ marginBottom: 40 }}
          name="dueDate"
          label="Due date"
          tooltip="You can only extend forward the due date of the assignment."
          rules={[
            {
              required: true,
              message: "Please input the due date of the assignment!",
            },
          ]}
        >
          <DatePicker
            style={{
              width: "100%",
            }}
            showTime
            disabledDate={disabledDate}
            format="DD-MM-YYYY HH:mm:ss"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDateModal;
