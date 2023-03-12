import type { Attachment, Submission } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import MyTable from "src/components/common/Table";
import { DownloadIcon, TrashIcon } from "src/components/common/Icons";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import { getDownloadUrl } from "src/utils/helper";
import {
  Button,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";

const { Column } = Table;

function AttachmentsTable({
  data,
  onFilesDeleted,
}: {
  data: Attachment[] | Submission[];
  onFilesDeleted?: () => void;
}) {
  const deleteAttachment = trpc.assignment.deleteAttachment.useMutation();
  const deleteSubmission = trpc.submission.deleteSubmission.useMutation();
  const isSubmission = (data: any): data is Submission => {
    return "studentId" in data;
  };

  const isSubmissionArray = (data: any): data is Submission[] => {
    return isSubmission(data[0]);
  };

  const handleDeleteFile = async (data: Attachment | Submission) => {
    // if (!confirm("Confirm delete file ?")) return;
    if (isSubmission(data)) {
      await deleteSubmission.mutateAsync({
        submissionId: data.id,
      });
      message.success("Submission deleted successfully!");
    } else {
      await deleteAttachment.mutateAsync({
        attachmentId: data.id,
      });
      message.success("Attachment deleted successfully!");
    }
    onFilesDeleted?.();
  };

  if (isSubmissionArray(data)) {
    return (
      <MyTable
        headers={["Filename", "Grade", "Actions"]}
        rows={data.map((submission) => [
          submission.filename,
          submission.grade ?? "Not graded yet",
          <span key={submission.id} className="flex items-center gap-4">
            <LinkButton
              variant={LinkButtonVariant.Primary}
              className="pl-0"
              onClick={() =>
                getDownloadUrl({
                  submissionId: submission.id,
                  filename: submission.filename,
                  studentId: submission.studentId,
                })
              }
            >
              <DownloadIcon /> Download
            </LinkButton>
            {onFilesDeleted && (
              <LinkButton
                variant={LinkButtonVariant.Danger}
                onClick={() => handleDeleteFile(submission)}
              >
                <TrashIcon />
                Delete
              </LinkButton>
            )}
          </span>,
        ])}
      />
    );
  } else {
    return (
      <div className="overflow-x-auto">
        <Table
          dataSource={data}
          // bordered
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
          }}
          rowKey={(record) => record.id}
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
              );
            },
          }}
        >
          <Column<Attachment>
            title="#"
            key="index"
            render={(_text, _record, index) => <span>{index + 1}</span>}
          />
          <Column<Attachment>
            title="File name"
            dataIndex="filename"
            key="filename"
            sorter={(a, b) => a.filename.localeCompare(b.filename)}
            sortDirections={["descend", "ascend"]}
          />
          {/* <Column<Attachment>
            title="Created at"
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
          /> */}
          <Column<Attachment>
            title="Type"
            dataIndex="type"
            key="type"
            render={(type) => {
              return (
                <Tag color={type === "attachment" ? "blue" : "green"}>
                  {type.toUpperCase()}
                </Tag>
              );
            }}
            filters={[
              {
                text: "Attachment",
                value: "attachment",
              },
              {
                text: "Answer",
                value: "answer",
              },
            ]}
            //@ts-expect-error - this is the filter
            onFilter={(value, record) => record.subject.indexOf(value) === 0}
          />
          <Column<Attachment>
            title="Action"
            key="action"
            render={(_, record) => (
              <Space size="middle">
                <LinkButton
                  variant={LinkButtonVariant.Primary}
                  className="pl-0"
                  onClick={() =>
                    getDownloadUrl({
                      attachmentId: record.id,
                      filename: record.filename,
                      assignmentId: record.assignmentId,
                    })
                  }
                >
                  <DownloadIcon /> Download
                </LinkButton>
                <Popconfirm
                  title="Delete assignment"
                  description="Are you sure to delete this assignment?"
                  onConfirm={() => {
                    handleDeleteFile(record);
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
    );
  }
}

export default AttachmentsTable;
