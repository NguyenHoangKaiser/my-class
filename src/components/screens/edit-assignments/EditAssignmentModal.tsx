import { InboxOutlined } from "@ant-design/icons";
import type { Assignment, Classroom, Subject, User } from "@prisma/client";
import type { DatePickerProps } from "antd";
import { DatePicker, message, Select } from "antd";
import { Form, Input, Modal } from "antd";
import { trpc } from "src/utils/trpc";
import dayjs from "dayjs";

type EditAssignmentFormData = {
  name: string;
  description: string;
  subject: string;
  dueDate: DatePickerProps["value"];
  status: string;
};

interface EditAssignmentModalProp {
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
  assignment: Assignment | null | undefined;
}

const EditAssignmentModal: React.FC<EditAssignmentModalProp> = ({
  open,
  onCancel,
  refetch,
  classroom,
  assignment,
}) => {
  const [form] = Form.useForm<EditAssignmentFormData>();
  const editAssignment = trpc.assignment.updateAssignment.useMutation();

  const onFinish = async (
    values: EditAssignmentFormData,
    resetFields: () => void
  ) => {
    console.log("Received values of form: ", values);

    console.log("classroom", {
      classroomId: classroom?.id as string,
      name: values.name,
      description: values.description,
      subject: values.subject,
      dueDate: values["dueDate"]?.toISOString() as string,
    });
    await editAssignment.mutateAsync(
      {
        assignmentId: assignment?.id as string,
        name: values.name,
        description: values.description,
        subject: values.subject,
        dueDate: values["dueDate"]?.toISOString() as string,
        status: values.status,
      },
      {
        onSuccess: () => {
          message.success("Assignment updated successfully!");
          refetch();
          resetFields();
          onCancel();
        },
        onError: () => {
          message.error("Failed to update assignment");
        },
      }
    );
  };

  // eslint-disable-next-line arrow-body-style
  const disabledDate: DatePickerProps["disabledDate"] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().add(1, "day");
  };

  const initialDueDate = dayjs(assignment?.dueDate);

  return (
    <Modal
      open={open}
      title="Edit this assignment"
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
        name="edit-assignment"
        initialValues={{
          name: assignment?.name,
          description: assignment?.description,
          subject: assignment?.subject,
          dueDate: initialDueDate,
          status: assignment?.status,
        }}
      >
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
          label="Status"
          name="status"
          tooltip="The current status of this assignment"
          rules={[
            {
              required: true,
              message: "Please select a status!",
            },
          ]}
        >
          <Select
            options={[
              {
                label: "In progress",
                value: "progressing",
              },
              {
                label: "Completed",
                value: "completed",
              },
              {
                label: "Suspended",
                value: "suspended",
              },
            ]}
            placeholder="Please select assignment's status"
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

export default EditAssignmentModal;
