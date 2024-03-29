import {
  CommentOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Drawer,
  Popconfirm,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
} from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useToggle } from "react-use";
import { EmptyStateWrapper, MainHeading } from "src/components/common";
import LinkButton from "src/components/common/Button/LinkButton";
import { PencilSquare, TrashIcon } from "src/components/common/Icons";
import { useIsClassroomAdmin } from "src/hooks";
import useAntUpload from "src/hooks/useAntUpload";
import { getAssignmentStatusColor } from "src/utils/constants";
import { trpc } from "src/utils/trpc";

import CommentDrawer from "../assignments/CommentDrawer";
import EditAssignmentModal from "./EditAssignmentModal";
import EditDateModal from "./EditDateModal";
import EmptyStateAttachments from "./EmptyStateAttachments";
import { AttachmentsTable } from "src/components/common/Table";

export const EditAssignmentScreen = ({
  classroomId,
  assignmentId,
}: {
  classroomId: string;
  assignmentId: string;
}) => {
  const [showEditAssignmentModal, setShowEditAssignmentModal] =
    React.useState<boolean>(false);
  const [isEditDueDateModalOpen, toggleIsEditDueDateModalOpen] =
    useToggle(false);

  const classroomQuery = trpc.classroom.getClassroom.useQuery({ classroomId });

  const router = useRouter();

  useIsClassroomAdmin(classroomId);
  const createFileUrl = trpc.assignment.createFileUrl.useMutation();

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const { fileList, handleUpload, uploadProps, uploading } = useAntUpload({
    getUploadUrl: (fileToUpload: File) =>
      createFileUrl.mutateAsync({
        filename: fileToUpload.name,
        assignmentId,
      }),
    onFileUploaded: () => {
      attachmentsQuery.refetch();
    },
  });

  const deleteAssignment = trpc.assignment.deleteAssignment.useMutation();

  const attachmentsQuery = trpc.assignment.getAttachments.useQuery({
    assignmentId,
  });

  const assignmentQuery = trpc.classroom.getAssignment.useQuery({
    assignmentId,
  });

  const handleDeleteAssignment = async () => {
    await deleteAssignment.mutateAsync(
      { assignmentId },
      {
        onSuccess: () => {
          message.success("Assignment deleted successfully!");
          router.push(`/classrooms/${classroomId}`);
        },
        onError: () => {
          message.error("Something went wrong!");
        },
      }
    );
  };

  const handleOnAttachmentDelete = () => {
    attachmentsQuery.refetch();
  };

  const formattedDueDate = assignmentQuery.data?.dueDate
    ? dayjs(assignmentQuery.data?.dueDate).format("DD-MM-YYYY hh:mm A")
    : "N/A";

  const isNotDue = assignmentQuery.data?.dueDate
    ? dayjs().isBefore(assignmentQuery.data?.dueDate)
    : false;

  const assignment = assignmentQuery.data;

  return (
    <>
      <MainHeading
        titleStyle="text-primary-700 dark:text-primary-500"
        title="Assignment details"
      >
        {assignmentQuery.isLoading ? (
          <Space size="middle">
            <Skeleton.Input active size="large" />
            <Skeleton.Input active size="large" />
            <Skeleton.Button active size="large" />
          </Space>
        ) : (
          <Space size="middle">
            {assignment?.status !== "completed" ? (
              <Tooltip title="You can extend the due date of assignment">
                <Tag
                  color={isNotDue ? "green" : "red"}
                  onClick={() => toggleIsEditDueDateModalOpen()}
                  icon={<EditOutlined />}
                  style={{
                    display: "flex",
                    fontSize: "1rem",
                    height: 40,
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                >
                  Due on {formattedDueDate}
                </Tag>
              </Tooltip>
            ) : (
              <Tag
                color={isNotDue ? "green" : "red"}
                style={{
                  display: "flex",
                  fontSize: "1rem",
                  height: 40,
                  alignItems: "center",
                  gap: 10,
                  justifyContent: "space-between",
                }}
              >
                Due on {formattedDueDate}
              </Tag>
            )}
            <Tag
              color={getAssignmentStatusColor(assignment?.status as string)}
              style={{
                display: "flex",
                fontSize: "1rem",
                height: 40,
                alignItems: "center",
              }}
            >
              {assignment?.status.toUpperCase()}
            </Tag>
            <Tag
              onClick={showDrawer}
              color="cyan"
              style={{
                display: "flex",
                fontSize: "1rem",
                height: 40,
                alignItems: "center",
                gap: 10,
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <CommentOutlined />
            </Tag>
          </Space>
        )}
        <Space size="large">
          <LinkButton onClick={() => setShowEditAssignmentModal(true)}>
            <PencilSquare /> Edit
          </LinkButton>
          <Popconfirm
            title="Delete assignment"
            placement="bottomRight"
            description="Are you sure to delete this assignment?"
            onConfirm={() => {
              handleDeleteAssignment();
            }}
            okText="Yes"
            cancelText="No"
          >
            <Typography.Link type="danger" className="flex items-center gap-1">
              <TrashIcon /> Delete
            </Typography.Link>
          </Popconfirm>
        </Space>
      </MainHeading>

      {assignmentQuery.isLoading ? (
        <div className="mx-10">
          <Skeleton
            paragraph={{
              rows: 9,
              width: [
                "20%",
                "50%",
                "50%",
                "20%",
                "50%",
                "50%",
                "40%",
                "40%",
                "10%",
              ],
            }}
            active
            title={false}
          />
          <Skeleton.Input
            active
            size="large"
            block
            style={{
              height: 100,
              marginTop: 20,
            }}
          />
        </div>
      ) : (
        <div className="mx-10">
          <section className="px-5">
            <h2 className="mb-4 text-3xl">Title</h2>
            <div className="mb-5">
              <Typography.Title level={4}>{assignment?.name}</Typography.Title>
            </div>
          </section>
          <section className="px-5">
            <h2 className="mb-4 text-3xl">Description</h2>
            <div className="mb-5">
              <ReactMarkdown className="prose dark:prose-invert">{`${assignment?.description}`}</ReactMarkdown>
            </div>
            <div className="mb-5">
              <Typography.Title level={4}>
                Created at:{" "}
                <Typography.Text
                  style={{
                    fontSize: "1rem",
                  }}
                  type="secondary"
                >
                  {dayjs(assignment?.createdAt).format("DD-MM-YYYY hh:mm A")}
                </Typography.Text>
              </Typography.Title>
            </div>
            <div className="mb-5">
              <Typography.Title level={4}>
                Last updated at:{" "}
                <Typography.Text
                  style={{
                    fontSize: "1rem",
                  }}
                  type="success"
                >
                  {dayjs(assignment?.updatedAt).format("DD-MM-YYYY hh:mm A")}
                </Typography.Text>
              </Typography.Title>
            </div>
            <div className="mb-5">
              <EmptyStateWrapper
                EmptyComponent={<EmptyStateAttachments />}
                NonEmptyComponent={
                  <AttachmentsTable
                    data={attachmentsQuery.data ?? []}
                    onFilesDeleted={handleOnAttachmentDelete}
                  />
                }
                isLoading={attachmentsQuery.isInitialLoading}
                data={attachmentsQuery.data}
              />
            </div>
            {assignment?.status !== "completed" && (
              <div className="relative mb-8 flex items-start justify-between gap-4">
                <Upload {...uploadProps}>
                  <Button
                    style={{ alignItems: "center", display: "flex" }}
                    icon={<UploadOutlined />}
                  >
                    Select File
                  </Button>
                </Upload>
                {fileList.length > 0 && (
                  <Button
                    type="primary"
                    style={{
                      position: "absolute",
                      left: 150,
                      top: 0,
                    }}
                    onClick={handleUpload}
                    loading={uploading}
                  >
                    {uploading ? "Uploading" : "Start Upload"}
                  </Button>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      <Drawer
        placement="right"
        onClose={onClose}
        open={open}
        title="Assignment comments"
      >
        <CommentDrawer assignmentId={assignmentId} />
      </Drawer>

      {assignmentQuery.data?.dueDate && (
        <EditDateModal
          open={isEditDueDateModalOpen}
          refetch={assignmentQuery.refetch}
          onCancel={() => toggleIsEditDueDateModalOpen(false)}
          assignment={assignment}
        />
      )}

      <EditAssignmentModal
        open={showEditAssignmentModal}
        refetch={assignmentQuery.refetch}
        classroom={classroomQuery.data}
        onCancel={() => setShowEditAssignmentModal(false)}
        assignment={assignment}
      />
    </>
  );
};
