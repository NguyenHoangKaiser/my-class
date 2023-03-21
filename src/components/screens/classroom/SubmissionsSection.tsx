import classNames from "classnames";
import { useForm } from "react-hook-form";
import { useToggle, useWindowSize } from "react-use";
import Button, { Variant } from "src/components/common/Button";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import FormGroup from "src/components/common/Form/FormGroup";
import { trpc } from "src/utils/trpc";
import { Form, Input, Table, Typography } from "antd";
import type { Submission, User } from "@prisma/client";
import React, { useContext, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import type { InputRef } from "antd";
import type { FormInstance } from "antd/es/form";
import Link from "next/link";

type DataType =
  | Submission & {
      student: User;
      assignmentName: string;
    };

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof DataType;
  record: DataType;
  handleSave: (record: DataType) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form?.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form?.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex as string}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table<DataType>>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

//TODO: Only when the teacher has downloaded the submission, the grade will be editable

function SubmissionsSection({ classroomId }: { classroomId: string }) {
  const submissionsQuery = trpc.submission.getSubmissionForClassroom.useQuery({
    classroomId,
  });

  const submissions = submissionsQuery.data;
  console.log(submissions);

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

  const defaultColumns: (ColumnTypes[number] & {
    editable?: boolean;
    dataIndex?: string;
  })[] = [
    {
      title: "#",
      key: "index",
      render: (_text, _record, index) => <span>{index + 1}</span>,
      fixed: "left",
      // ellipsis
      width: 50,
    },
    {
      title: "Assignment Name",
      dataIndex: "assignmentName",
      key: "assignmentName",
      editable: false,
      fixed: "left",
      width: 150,
      ellipsis: true,
      sorter: (a: any, b: any) => a.filename.localeCompare(b.assignmentName),
    },
    {
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      editable: true,
    },
  ];

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

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
      }),
    };
  });

  return (
    // <section>
    //   <h3 className="mb-6 text-center">Submissions</h3>
    //   {submissionsQuery.data && submissionsQuery.data?.length > 0 ? (
    //     <Table
    //       headers={[
    //         "Student",
    //         "Grade",
    //         "Assignment Name",
    //         "Assignment Number",
    //         "File Name",
    //         "actions",
    //       ]}
    //       rows={submissionsQuery.data.map((submission) => [
    //         submission.studentName,
    //         <>
    //           <GradeEditable
    //             submission={submission}
    //             onUpdate={submissionsQuery.refetch}
    //           />
    //         </>,
    //         submission.assignmentName,
    //         submission.assignmentNumber,
    //         submission.fileName,
    //         <div className="-ml-4" key={submission.id}>
    //           <LinkButton
    //             variant={LinkButtonVariant.Primary}
    //             onClick={() =>
    //               getDownloadUrl({
    //                 submissionId: submission.id,
    //                 filename: submission.fileName,
    //                 studentId: submission.studentId,
    //               })
    //             }
    //           >
    //             <DownloadIcon /> Download
    //           </LinkButton>
    //         </div>,
    //       ])}
    //     />
    //   ) : (
    //     <EmptyStateAttachments isSubmissions={true} />
    //   )}
    // </section>
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
        </Table>
      </div>
    </div>
  );
}

export default SubmissionsSection;
