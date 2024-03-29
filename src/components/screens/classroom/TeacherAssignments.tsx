import type {
  Assignment,
  Attachment,
  Classroom,
  Subject,
  Submission,
  User,
} from "@prisma/client";
import { Button, Popconfirm, Space, Table, Tag, Typography } from "antd";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useState } from "react";
import { EyeIcon, TrashIcon } from "src/components/common/Icons";
import {
  AssignmentStatusFilterOptions,
  getAssignmentStatusColor,
} from "src/utils/constants";
import { getTagColor } from "src/utils/helper";

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const deleteSelection = () => {
    setLoading(true);

    Promise.all(
      selectedRowKeys.map((id) => handleDeleteAssignment(id.toString()))
    ).then(() => {
      setLoading(false);
      setSelectedRowKeys([]);
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <div className="mb-3 flex items-center gap-8">
        <h2 className="text-2xl">
          Your Assignments ({totalAssignments} total)
        </h2>
        <Button type="primary" size="large" onClick={openAssignmentModal}>
          Create an Assignment
        </Button>
        {hasSelected && (
          <Popconfirm
            title="Delete assignment"
            description="Are you sure to delete selected assignments?"
            onConfirm={deleteSelection}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger loading={loading}>
              Delete selected
            </Button>
          </Popconfirm>
        )}
      </div>
      <Table
        dataSource={assignments}
        bordered
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        pagination={{
          pageSize: 5,
          hideOnSinglePage: true,
        }}
        scroll={{ x: 1200 }}
      >
        <Column<DataType>
          title="#"
          key="index"
          render={(_text, _record, index) => <span>{index + 1}</span>}
          fixed="left"
          // ellipsis
          width={50}
        />
        <Column<DataType>
          title="Name"
          dataIndex="name"
          key="name"
          sorter={(a, b) => a.name.localeCompare(b.name)}
          sortDirections={["ascend", "descend"]}
          width={250}
          fixed="left"
          ellipsis
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
          sortDirections={["ascend", "descend"]}
          // width={200}
          // ellipsis
          // responsive={["md"]}
        />
        <Column<DataType>
          title="Subject"
          dataIndex="subject"
          key="subject"
          render={(subject) => {
            return <Tag color={getTagColor(subject)}>{subject}</Tag>;
          }}
          filters={classroom?.subjects.map((subject) => ({
            text: subject.name,
            value: subject.name,
          }))}
          //@ts-expect-error - this is the filter
          onFilter={(value, record) => record.subject.indexOf(value) === 0}
          width={180}
          // ellipsis
        />
        <Column<DataType>
          title="Attachment"
          dataIndex="attachments"
          key="attachments"
          render={(attachments) => attachments.length}
          sorter={(a, b) => a.attachments.length - b.attachments.length}
          sortDirections={["ascend", "descend"]}
          // width={120}
        />
        <Column<DataType>
          title="Submission"
          dataIndex="submissions"
          key="submissions"
          sorter={(a, b) => a.submissions.length - b.submissions.length}
          sortDirections={["ascend", "descend"]}
          render={(submission) => submission.length}
          // width={120}
          // ellipsis
        />
        <Column<DataType>
          title="Status"
          dataIndex="status"
          key="status"
          render={(status) => (
            <Tag color={getAssignmentStatusColor(status)}>
              {status.toUpperCase()}
            </Tag>
          )}
          filters={AssignmentStatusFilterOptions}
          //@ts-expect-error - this is the filter
          onFilter={(value, record) => record.status.indexOf(value) === 0}
          // width={120}
          // ellipsis
        />
        <Column<DataType>
          title="Action"
          key="action"
          width={160}
          fixed="right"
          render={(_, record) => (
            <Space size="middle">
              <Link
                className="flex items-center gap-1 text-blue-400"
                href={`/classrooms/${record.classroomId}/assignments/${record.id}/edit`}
              >
                <EyeIcon /> View
              </Link>
              <Popconfirm
                title="Delete assignment"
                description="Are you sure to delete this assignment?"
                onConfirm={() => {
                  handleDeleteAssignment(record.id);
                }}
                okText="Yes"
                cancelText="No"
                placement="topRight"
              >
                <Typography.Link
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1px",
                    wordBreak: "keep-all",
                  }}
                  type="danger"
                >
                  <TrashIcon /> Delete
                </Typography.Link>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>
    </>
  );
}

export default TeacherAssignments;
