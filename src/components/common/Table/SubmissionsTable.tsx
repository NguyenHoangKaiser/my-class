import type { Submission } from "@prisma/client";
import { Button, Popconfirm, Table, Tag, Typography, message } from "antd";
import { useState } from "react";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import { DownloadIcon, TrashIcon } from "src/components/common/Icons";
import {
  SubmissionStatusFilterOptions,
  getSubmissionStatusColor,
} from "src/utils/constants";
import { getDownloadUrl } from "src/utils/helper";
import { trpc } from "src/utils/trpc";

const { Column } = Table;

function SubmissionsTable({
  data,
  onFilesDeleted,
  isLoadingSubmission,
}: {
  data: Submission[];
  onFilesDeleted?: () => void;
  isLoadingSubmission?: boolean;
}) {
  const deleteSubmission = trpc.submission.deleteSubmission.useMutation();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDeleteFile = async (data: Submission) => {
    await deleteSubmission.mutateAsync({
      submissionId: data.id,
    });
    message.success("Submission deleted successfully!");
    onFilesDeleted?.();
  };

  const handleDeleteSubmission = async (id: string) => {
    await deleteSubmission.mutateAsync({
      submissionId: id,
    });
  };

  const deleteSelection = () => {
    setLoading(true);
    Promise.all(
      selectedRowKeys.map((id) => handleDeleteSubmission(id as string))
    ).then(() => {
      message.success("Submissions deleted successfully!");
      setLoading(false);
      onFilesDeleted?.();
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
      <div className="mb-5 flex items-center gap-8 ">
        <h2 className="text-3xl">Submissions</h2>
        {hasSelected && (
          <Popconfirm
            title="Delete selected files"
            description="Are you sure to delete selected files?"
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
      <div className="overflow-x-auto">
        <Table
          dataSource={data}
          loading={isLoadingSubmission}
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
          }}
          rowKey={(record) => record.id}
          rowSelection={onFilesDeleted ? rowSelection : undefined}
        >
          <Column<Submission>
            title="#"
            key="index"
            render={(_text, _record, index) => <span>{index + 1}</span>}
          />
          <Column<Submission>
            title="File name"
            dataIndex="filename"
            key="filename"
            sorter={(a, b) => a.filename.localeCompare(b.filename)}
            sortDirections={["ascend", "descend"]}
          />
          <Column<Submission>
            title="Grade"
            dataIndex="grade"
            key="grade"
            render={(grade) => <span>{grade ? grade : "N/A"}</span>}
            sorter={(a, b) => (a.grade || 0) - (b.grade || 0)}
            sortDirections={["ascend", "descend"]}
          />
          <Column<Submission>
            title="Status"
            dataIndex="status"
            key="status"
            render={(status) => {
              return (
                <Tag color={getSubmissionStatusColor(status)}>
                  {status.toUpperCase()}
                </Tag>
              );
            }}
            filters={SubmissionStatusFilterOptions}
            //@ts-expect-error - this is the filter
            onFilter={(value, record) => record.status.indexOf(value) === 0}
          />
          <Column<Submission>
            title="Action"
            key="action"
            render={(_, record) => (
              <div className="flex gap-6">
                <LinkButton
                  variant={LinkButtonVariant.Primary}
                  className="pl-0"
                  onClick={() =>
                    getDownloadUrl({
                      submissionId: record.id,
                      studentId: record.studentId,
                      filename: record.filename,
                    })
                  }
                >
                  <DownloadIcon /> Download
                </LinkButton>
                {onFilesDeleted && (
                  <div className="flex items-center gap-7">
                    <Popconfirm
                      title="Delete submission"
                      description="Are you sure to delete this submission?"
                      onConfirm={() => {
                        handleDeleteFile(record);
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Typography.Link
                        type="danger"
                        className="flex items-center gap-1"
                      >
                        <TrashIcon /> Delete
                      </Typography.Link>
                    </Popconfirm>
                  </div>
                )}
              </div>
            )}
          />
        </Table>
      </div>
    </>
  );
}

export default SubmissionsTable;
