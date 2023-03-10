import type {
  Assignment,
  Attachment,
  Classroom,
  Subject,
  Submission,
  User,
} from "@prisma/client";
import Link from "next/link";
import { PencilSquare, TrashIcon } from "src/components/common/Icons";
import { Button, Table, Space, Tag, Popconfirm, Typography } from "antd";
import dayjs from "dayjs";
import React from "react";

type DataType = Assignment & {
  attachments: Attachment[];
  submissions: Submission[];
};
const { Column } = Table;

function TeacherAssignments({
  assignments,
  openAssignmentModal,
  handleDeleteAssignment,
  classroom,
}: {
  assignments: (Assignment & {
    submissions: Submission[];
    attachments: Attachment[];
  })[];
  openAssignmentModal: () => void;
  handleDeleteAssignment: (id: string) => Promise<void>;
  classroom:
    | (Classroom & {
        students: User[];
        subjects: Subject[];
      })
    | null
    | undefined;
}) {
  const totalAssignments = assignments.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl">
          Your Assignments ({totalAssignments} total)
        </h2>
        <Button type="primary" size="large" onClick={openAssignmentModal}>
          Create an Assignment
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table dataSource={assignments}>
          <Column<DataType>
            title="#"
            key="index"
            render={(_text, _record, index) => <span>{index + 1}</span>}
          />
          <Column<DataType>
            title="Name"
            dataIndex="name"
            key="name"
            sorter={(a, b) => a.name.localeCompare(b.name)}
            sortDirections={["descend", "ascend"]}
          />
          <Column<DataType>
            title="Due date"
            dataIndex="dueDate"
            key="dueDate"
            render={(dueDate) => (
              <Typography.Text
                type={dayjs(dueDate).isBefore(dayjs()) ? "danger" : "success"}
              >
                {dayjs(dueDate).format("DD-MM-YYYY hh:mm A")}
              </Typography.Text>
            )}
            sorter={(a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate))}
            sortDirections={["descend", "ascend"]}
          />
          <Column<DataType>
            title="Subject"
            dataIndex="subject"
            key="subject"
            render={(subject) => {
              const color =
                subject.length > 8
                  ? "purple"
                  : subject.length > 5
                  ? "cyan"
                  : "blue";
              return <Tag color={color}>{subject}</Tag>;
            }}
            filters={classroom?.subjects.map((subject) => ({
              text: subject.name,
              value: subject.name,
            }))}
            //@ts-expect-error - this is the filter
            onFilter={(value, record) => record.subject.indexOf(value) === 0}
          />
          <Column<DataType>
            title="Attachment"
            dataIndex="attachments"
            key="attachments"
            render={(attachments) => attachments.length}
            sorter={(a, b) => a.attachments.length - b.attachments.length}
            sortDirections={["descend", "ascend"]}
          />
          <Column<DataType>
            title="Submission"
            dataIndex="submissions"
            key="submissions"
            sorter={(a, b) => a.submissions.length - b.submissions.length}
            sortDirections={["descend", "ascend"]}
            render={(submission) => submission.length}
          />
          <Column<DataType>
            title="Status"
            dataIndex="status"
            key="status"
            render={(status) => (
              <Tag
                color={
                  status === "progressing"
                    ? "green"
                    : status === "completed"
                    ? "red"
                    : "orange"
                }
              >
                {status.toUpperCase()}
              </Tag>
            )}
            filters={[
              {
                text: "Progressing",
                value: "progressing",
              },
              {
                text: "Completed",
                value: "completed",
              },
              {
                text: "Suspended",
                value: "suspended",
              },
            ]}
            //@ts-expect-error - this is the filter
            onFilter={(value, record) => record.status.indexOf(value) === 0}
          />
          <Column<DataType>
            title="Action"
            key="action"
            render={(_, record) => (
              <Space size="middle">
                <Link
                  className="flex items-center gap-1 text-blue-400"
                  href={`/classrooms/${record.classroomId}/assignments/${record.id}/edit`}
                >
                  <PencilSquare /> Edit
                </Link>
                <Popconfirm
                  title="Delete assignment"
                  description="Are you sure to delete this assignment?"
                  onConfirm={() => {
                    handleDeleteAssignment(record.id);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <Typography.Link
                    href="#"
                    type="danger"
                    className="flex items-center gap-1"
                  >
                    <TrashIcon /> Delete
                  </Typography.Link>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </div>
    </div>
  );
}

export default TeacherAssignments;
