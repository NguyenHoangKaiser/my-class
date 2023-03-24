import type { Submission, User } from "@prisma/client";
import { Button, Popconfirm, Table, Tag, Typography } from "antd";
import type { Rule } from "antd/es/form";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useWindowSize } from "react-use";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import { DownloadIcon } from "src/components/common/Icons";
import { useEditableTable } from "src/hooks";
import {
  getSubmissionStatusColor,
  SubmissionStatusFilterOptions,
} from "src/utils/constants";
import { firstLetterToUpperCase, getDownloadUrl } from "src/utils/helper";
import { trpc } from "src/utils/trpc";

type DataType =
  | Submission & {
      student: User;
      assignmentName: string;
      dueDate: string;
    };

type EditableTableProps = Parameters<typeof Table<DataType>>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

//TODO: Only when the teacher has downloaded the submission, the grade will be editable

function SubmissionsSection({ classroomId }: { classroomId: string }) {
  const { components } = useEditableTable<DataType>();

  const submissionsQuery = trpc.submission.getSubmissionForClassroom.useQuery({
    classroomId,
  });

  const router = useRouter();

  const submissions = submissionsQuery.data;

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [loading, setLoading] = useState(false);
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const { width } = useWindowSize();

  // get student name array from submissions and remove duplicates
  const studentNames = submissions
    ? submissions
        .map((submission) => submission.student.name)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((name) => ({ text: name as string, value: name as string }))
    : [];

  const assignmentNames = submissions
    ? submissions
        .map((submission) => submission.assignmentName)
        .filter((value, index, self) => self.indexOf(value) === index)
        .map((name) => ({ text: name as string, value: name as string }))
    : [];

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex?: string | string[];
    rules?: Rule[];
  })[] = [
    {
      title: "#",
      key: "index",
      render: (_text, _record, index) => <span>{index + 1}</span>,
      fixed: "left",
      width: 50,
    },
    {
      title: "Assignment Name",
      dataIndex: "assignmentName",
      key: "assignmentName",
      editable: false,
      width: 180,
      ellipsis: true,
      filters: assignmentNames,
      //@ts-expect-error - this is the filter function
      onFilter: (value, record) => record.assignmentName.indexOf(value) === 0,
      render: (text, record) => (
        <Typography.Link
          onClick={() => {
            router.push(
              `/classrooms/${classroomId}/assignments/${record.assignmentId}/edit`
            );
          }}
        >
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Student Name",
      dataIndex: ["student", "name"],
      key: "studentName",
      editable: false,
      width: 200,
      filters: studentNames,
      //@ts-expect-error - this is the filter function
      onFilter: (value, record) => record.student.name.indexOf(value) === 0,
    },
    {
      title: "File Name",
      dataIndex: "filename",
      key: "filename",
      editable: false,
      width: 200,
      ellipsis: true,
      sorter: (a, b) => a.filename.localeCompare(b.filename),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Submission Date",
      dataIndex: "updatedAt",
      key: "updatedAt",
      editable: false,
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt)),
      render: (date, record) => (
        <Typography.Text
          type={
            dayjs(date).isAfter(dayjs(record.dueDate)) ? "danger" : "success"
          }
        >
          {dayjs(date).format("DD-MM-YYYY hh:mm A")}
        </Typography.Text>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      editable: false,
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate)),
      render: (dueDate) => (
        <Typography.Text
          type={dayjs(dueDate).isBefore(dayjs()) ? "danger" : "success"}
        >
          {dayjs(dueDate).format("DD-MM-YYYY hh:mm A")}
        </Typography.Text>
      ),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      rules: [
        {
          required: true,
          message: "Grade is required",
        },
        {
          message:
            "Grade must be a number between 0 and 10 and have 1 decimal place at most",
          pattern: /^([0-9]|10)(\.[0-9])?$/,
        },
      ],
      key: "grade",
      editable: true,
      width: 90,
      render: (grade) => <span>{grade ? grade : "N/A"}</span>,
      sorter: (a, b) => (a.grade || 0) - (b.grade || 0),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: false,
      width: 100,
      render: (status) => (
        <Tag color={getSubmissionStatusColor(status)}>
          {firstLetterToUpperCase(status)}
        </Tag>
      ),
      filters: SubmissionStatusFilterOptions,
      //@ts-expect-error - this is the filter function
      onFilter: (value, record) => record.status.indexOf(value) === 0,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: width < 768 ? undefined : "right",
      width: 60,
      render: (_text, submissions) => (
        <LinkButton
          variant={LinkButtonVariant.Primary}
          onClick={() =>
            getDownloadUrl({
              submissionId: submissions.id,
              filename: submissions.filename,
              studentId: submissions.studentId,
            })
          }
        >
          <DownloadIcon /> Download
        </LinkButton>
      ),
    },
  ];

  const handleSave = (row: DataType) => {
    console.log(row);
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        rules: col.rules,
      }),
    };
  });

  const deleteSelection = () => {
    setLoading(true);

    Promise.all(
      selectedRowKeys.map((id) => handleDownloadSubmission(id as string))
    ).then(() => {
      message.success("Attachments deleted successfully!");
      setLoading(false);
      onFilesDeleted?.();
      setSelectedRowKeys([]);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl">Submissions</h2>
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
          components={components}
          rowClassName={() => "editable-row"}
          columns={columns as ColumnTypes}
          dataSource={submissions}
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
        />
        {/* <Column<DataType>
            title="#"
            key="index"
            render={(_text, _record, index) => <span>{index + 1}</span>}
            fixed="left"
            // ellipsis
            width={50}
          />
          <Column<DataType>
            title="Assignment Name"
            dataIndex="assignmentName"
            key="assignmentName"
            // render={}
            sorter={(a, b) => a.filename.localeCompare(b.assignmentName)}
            // sortDirections={["ascend", "descend"]}
            width={150}
            fixed="left"
            ellipsis
          />
          <Column<DataType>
            title="File Name"
            dataIndex="filename"
            key="filename"
            // render={}
            sorter={(a, b) => a.filename.localeCompare(b.filename)}
            // sortDirections={["ascend", "descend"]}
            // width={150}
            // fixed="left"
            ellipsis
          />
          <Column<DataType>
            title="Student Name"
            dataIndex={["student", "name"]}
            key="studentName"
            filters={studentNames}
            onFilter={(value, record) =>
              //@ts-expect-error - this is the filter function
              record.student.name?.indexOf(value) === 0
            }
            // width={150}
            // fixed="left"
            ellipsis
          />
          <Column<DataType>
            title="Submit Date"
            dataIndex="updatedAt"
            key="updatedAt"
            render={(updatedAt) => (
              <Typography.Text
              // type={dayjs(updatedAt).isBefore(dayjs()) ? "danger" : "success"}
              >
                {dayjs(updatedAt).format("DD-MM-YYYY hh:mm A")}
              </Typography.Text>
            )}
            sorter={(a, b) => dayjs(a.updatedAt).diff(dayjs(b.updatedAt))}
            sortDirections={["ascend", "descend"]}
            // width={200}
            // ellipsis
            // responsive={["md"]}
          /> */}
        {/* <Column<DataType>
            title="Name"
            dataIndex="name"
            key="name"
            // render={}
            // sorter={(a, b) => a.name.localeCompare(b.name)}
            // sortDirections={["ascend", "descend"]}
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
            responsive={["md"]}
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
              </Space>
            )}
          /> */}
      </div>
    </div>
  );
}

export default SubmissionsSection;
