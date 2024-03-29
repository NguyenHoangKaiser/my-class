import { DownOutlined } from "@ant-design/icons";
import type { Attachment } from "@prisma/client";
import type { MenuProps } from "antd";
import {
  Button,
  Dropdown,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import { useState } from "react";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import { DownloadIcon, TrashIcon } from "src/components/common/Icons";
import { getDownloadUrl } from "src/utils/helper";
import { trpc } from "src/utils/trpc";

const { Column } = Table;

const items: MenuProps["items"] = [
  {
    label: "Attachment",
    key: "attachment",
  },
  {
    label: "Answer",
    key: "answer",
  },
];

function AttachmentsTable({
  data,
  onFilesDeleted,
  isLoadingAttachment,
}: {
  data: Attachment[];
  onFilesDeleted?: () => void;
  isLoadingAttachment?: boolean;
}) {
  const deleteAttachment = trpc.assignment.deleteAttachment.useMutation();

  const markAnswer = trpc.assignment.markAnswerAttachment.useMutation();

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDeleteFile = async (data: Attachment) => {
    await deleteAttachment.mutateAsync({
      attachmentId: data.id,
    });
    message.success("Attachment deleted successfully!");
    onFilesDeleted?.();
  };

  const handleDeleteAttachment = async (id: string) => {
    await deleteAttachment.mutateAsync({
      attachmentId: id,
    });
  };

  const handleMarkAnswer = async ({
    data,
    type,
  }: {
    data: Attachment;
    type: string;
  }) => {
    await markAnswer.mutateAsync({
      attachmentId: data.id,
      type,
    });
    message.success(`Attachment marked as ${type} successfully!`);
    onFilesDeleted?.();
  };

  const deleteSelection = () => {
    setLoading(true);

    Promise.all(
      selectedRowKeys.map((id) => handleDeleteAttachment(id as string))
    ).then(() => {
      message.success("Attachments deleted successfully!");
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
        <h2 className="text-3xl">Attachments</h2>
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
          loading={isLoadingAttachment}
          // bordered
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
          }}
          rowKey={(record) => record.id}
          rowSelection={onFilesDeleted ? rowSelection : undefined}
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
            sortDirections={["ascend", "descend"]}
          />
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
            onFilter={(value, record) => record.type.indexOf(value) === 0}
          />
          <Column<Attachment>
            title="Action"
            key="action"
            render={(_, record) => (
              <div className="flex gap-6">
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
                {onFilesDeleted && (
                  <div className="flex items-center gap-7">
                    <Dropdown
                      menu={{
                        items,
                        selectable: true,
                        defaultSelectedKeys:
                          record.type === "answer"
                            ? ["answer"]
                            : ["attachment"],
                        onSelect: (value) => {
                          handleMarkAnswer({ data: record, type: value.key });
                        },
                      }}
                    >
                      <Typography.Link>
                        <Space>
                          Type
                          <DownOutlined />
                        </Space>
                      </Typography.Link>
                    </Dropdown>
                    <Popconfirm
                      title="Delete attachment"
                      description="Are you sure to delete this attachment?"
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

export default AttachmentsTable;
