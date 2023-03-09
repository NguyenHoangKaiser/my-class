import type { Assignment, Attachment } from "@prisma/client";
import Link from "next/link";
import type { ReactNode } from "react";
import { DateTime } from "luxon";
import { PencilSquare } from "src/components/common/Icons";
// import Table from "src/components/common/Table";
import { Button, Table, Space, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

type DataType = Assignment & {
  attachments: Attachment[];
};

const columns: ColumnsType<DataType> = [
  {
    title: "#",
    key: "index",
    render: (_text, _record, index) => <span>{index + 1}</span>,
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    key: "dueDate",
    render: (_, { dueDate }) => (
      <span className="whitespace-nowrap">
        {dayjs(dueDate).format("DD-MM-YYYY hh:mm A")}
      </span>
    ),
  },
  {
    title: "Subject",
    dataIndex: "subject",
    key: "subject",
    render: (_, { subject }) => {
      const color =
        subject.length > 8 ? "purple" : subject.length > 5 ? "cyan" : "blue";
      return <Tag color={color}>{subject}</Tag>;
    },
  },
  {
    title: "Attachments",
    key: "attachments",
    render: (_, { attachments }) => attachments.length,
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link
          className="flex items-center gap-1"
          href={`/classrooms/${record.classroomId}/assignments/${record.id}/edit`}
        >
          <PencilSquare /> Edit
        </Link>
      </Space>
    ),
  },
];

function TeacherAssignments({
  assignments,
  openAssignmentModal,
  handleDeleteAssignment,
}: {
  assignments: (Assignment & {
    attachments: Attachment[];
  })[];
  openAssignmentModal: () => void;
  handleDeleteAssignment: (id: string) => Promise<void>;
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
        <Table columns={columns} dataSource={assignments} />
        {/* <Table
          headers={["Number", "Name", "Due Date", "Attachments", "Action"]}
          rows={assignments.map((assignment, idx) => [
            idx,
            assignment.name,
            <span key={idx} className="whitespace-nowrap">
              {DateTime.fromISO(assignment.dueDate).toLocaleString(
                DateTime.DATE_MED
              )}
            </span>,
            assignment.attachments.length,
            (
              <span className="flex gap-4">
                <Link
                  href={`/classrooms/${classroomId}/assignments/${assignment.id}/edit`}
                  className="link flex items-center gap-1"
                >
                  <PencilSquare /> Edit
                </Link>
              </span>
            ) as ReactNode,
          ])}
        /> */}
      </div>
    </div>
  );
}

export default TeacherAssignments;
