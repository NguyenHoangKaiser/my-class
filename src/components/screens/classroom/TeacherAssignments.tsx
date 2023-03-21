import type {
  Assignment,
  Attachment,
  Classroom,
  Subject,
  Submission,
  User,
} from "@prisma/client";
import Link from "next/link";
import { EyeIcon, TrashIcon } from "src/components/common/Icons";
import { Button, Table, Space, Tag, Popconfirm, Typography } from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import { useWindowSize } from "react-use";

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

  const { width } = useWindowSize();

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-8">
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
      <div className="mr-2">
        <Table
          dataSource={assignments}
          bordered
          rowSelection={rowSelection}
          rowKey={(record) => record.id}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
          }}
          style={{
            maxWidth: width - 323,
          }}
          scroll={{ x: true }}
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
            width={150}
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
            // width={110}
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
                    href="#"
                    type="danger"
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
