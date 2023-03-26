import type { Submission, User } from "@prisma/client";
import { Table, Tag, Typography, message } from "antd";
import type { Rule } from "antd/es/form";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";
import { useWindowSize } from "react-use";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import { DownloadIcon } from "src/components/common/Icons";
import { useEditableTable } from "src/hooks";
import {
  getSubmissionStatusColor,
  SubmissionStatus,
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

  const changeStatusSubmission =
    trpc.submission.changeStatusSubmission.useMutation();

  const updateGradeMutation = trpc.submission.updateGrade.useMutation();

  const router = useRouter();

  const submissions = submissionsQuery.data;

  const { width } = useWindowSize();

  const handleDownloadSubmission = async (submission: DataType) => {
    getDownloadUrl({
      submissionId: submission.id,
      filename: submission.filename,
      studentId: submission.studentId,
    });
    changeStatusSubmission.mutateAsync(
      {
        submissionId: submission.id,
        status: SubmissionStatus.viewed,
      },
      {
        onSuccess: () => {
          submissionsQuery.refetch();
        },
        onError(error) {
          message.error(error.message);
        },
      }
    );
  };

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
      width: 180,
      filters: studentNames,
      //@ts-expect-error - this is the filter function
      onFilter: (value, record) => record.student.name.indexOf(value) === 0,
    },
    {
      title: "File Name",
      dataIndex: "filename",
      key: "filename",
      editable: false,
      width: 180,
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
      fixed: "right",
      width: 60,
      render: (_text, submissions) => (
        <LinkButton
          className="px-0"
          variant={LinkButtonVariant.Primary}
          onClick={() => {
            handleDownloadSubmission(submissions);
          }}
        >
          <DownloadIcon /> Download
        </LinkButton>
      ),
    },
  ];

  const handleSave = (row: DataType) => {
    console.log(row);
    if (row.grade) {
      updateGradeMutation.mutate(
        {
          submissionId: row.id,
          //FIXME: typescript is seeing this as a number, but it's a string, so we need to convert it
          grade: Number(row.grade),
        },
        {
          onSuccess: () => {
            submissionsQuery.refetch();
            message.success("Grade updated successfully");
          },
          onError: (error) => {
            message.error(error.message);
          },
        }
      );
    }
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl">Submissions</h2>
      </div>
      <div className="mr-2">
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          columns={columns as ColumnTypes}
          dataSource={submissions}
          loading={submissionsQuery.isFetching}
          bordered
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
          }}
          style={{
            maxWidth: width - 323,
          }}
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}

export default SubmissionsSection;
