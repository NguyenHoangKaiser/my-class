import { InboxOutlined } from "@ant-design/icons";
import type { Classroom, Subject, User } from "@prisma/client";
import type { DatePickerProps } from "antd";
import { DatePicker, message, Select } from "antd";
import { Form, Input, Modal } from "antd";
import { trpc } from "src/utils/trpc";
import dayjs from "dayjs";

type CreateAssignmentFormData = {
  name: string;
  description: string;
  subject: string;
  dueDate: DatePickerProps["value"];
};
interface CreateAssignmentModalProp {
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

const CreateAssignmentModal: React.FC<CreateAssignmentModalProp> = ({
  open,
  onCancel,
  refetch,
  classroom,
}) => {
  const [form] = Form.useForm<CreateAssignmentFormData>();
  const createAssignment = trpc.classroom.createAssignment.useMutation();

  const onFinish = async (
    values: CreateAssignmentFormData,
    resetFields: () => void
  ) => {
    await createAssignment.mutateAsync(
      {
        classroomId: classroom?.id as string,
        name: values.name,
        description: values.description,
        subject: values.subject,
        dueDate: values["dueDate"]?.toISOString() as string,
      },
      {
        onSuccess: () => {
          message.success("Assignment created");
          refetch();
          resetFields();
          onCancel();
        },
        onError: () => {
          message.error("Create assignment unsuccessful");
        },
      }
    );
  };

  // eslint-disable-next-line arrow-body-style
  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().add(1, "day");
  };

  return (
    <Modal
      open={open}
      title="Create a new assignment"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          onFinish(values, form.resetFields);
        });
      }}
    >
      <Form form={form} layout="vertical" name="create-assignment">
        <Form.Item
          name="name"
          label="Assignment name"
          rules={[
            {
              required: true,
              message: "Please input the name of the assignment!",
            },
          ]}
        >
          <Input placeholder="Assignment name" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          tooltip="Markdown styling is supported."
          rules={[
            {
              required: true,
              message: "Please input the description of the assignment!",
            },
          ]}
        >
          <Input.TextArea placeholder="Description" showCount maxLength={200} />
        </Form.Item>
        <Form.Item
          label="Subjects"
          name="subject"
          tooltip="You can only select subjects that are taught in this classroom."
          rules={[
            {
              required: true,
              message: "Please select a subject!",
            },
          ]}
        >
          <Select
            options={classroom?.subjects.map((subject) => ({
              label: subject.name,
              value: subject.name,
            }))}
            notFoundContent={
              <div className="flex flex-col items-center justify-center">
                <InboxOutlined
                  style={{
                    fontSize: 30,
                  }}
                />{" "}
                This classroom has no subjects yet. Please add one first.
              </div>
            }
            placeholder="Please select assignment's subject"
          />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 40 }}
          name="dueDate"
          label="Due date"
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

export default CreateAssignmentModal;
