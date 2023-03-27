import { CommentOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Drawer, Tag, Typography, Upload } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { EmptyStateWrapper, MainHeading } from "src/components/common";
import useAntUpload from "src/hooks/useAntUpload";
import { getAssignmentStatusColor } from "src/utils/constants";
import { trpc } from "src/utils/trpc";
import AttachmentsTable from "../edit-assignments/AttachmentsTable";
import EmptyStateAttachments from "../edit-assignments/EmptyStateAttachments";
import CommentDrawer from "./CommentDrawer";

export const AssignmentScreen = ({
  assignmentId,
}: {
  assignmentId: string;
}) => {
  const assignmentQuery = trpc.classroom.getAssignment.useQuery({
    assignmentId,
  });

  const attachmentsQuery = trpc.assignment.getAttachments.useQuery({
    assignmentId,
  });

  const submissionQuery = trpc.submission.getSubmission.useQuery({
    assignmentId,
  });

  const createFileUrl = trpc.submission.createFileUrl.useMutation();

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
      submissionQuery.refetch();
    },
  });

  const handleOnSubmissionDelete = () => {
    submissionQuery.refetch();
  };

  const formattedDueDate = assignmentQuery.data?.dueDate
    ? dayjs(assignmentQuery.data?.dueDate).format("DD-MM-YYYY hh:mm A")
    : "N/A";

  const isNotDue = assignmentQuery.data?.dueDate
    ? dayjs().isBefore(assignmentQuery.data?.dueDate)
    : false;

  const assignment = assignmentQuery.data;

  return (
    <section>
      <MainHeading
        titleStyle="text-primary-700 dark:text-primary-500"
        title="Assignment details"
      >
        <div className="flex gap-4">
          <Tag
            color={isNotDue ? "green" : "red"}
            style={{
              display: "flex",
              fontSize: 16,
              height: 40,
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            Due on {formattedDueDate}
          </Tag>

          <Tag
            color={getAssignmentStatusColor(assignment?.status as string)}
            style={{
              display: "flex",
              fontSize: 16,
              height: 40,
              alignItems: "center",
            }}
          >
            {assignment?.status.toUpperCase()}
          </Tag>
          <Tag
            color="cyan"
            style={{
              display: "flex",
              fontSize: 16,
              height: 40,
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <CommentOutlined onClick={showDrawer} />
          </Tag>
        </div>
        {submissionQuery.data && submissionQuery.data.length > 0 ? (
          <Tag
            color="green"
            style={{
              display: "flex",
              fontSize: 16,
              height: 40,
              alignItems: "center",
            }}
          >
            Submitted {submissionQuery.data.length} submissions
          </Tag>
        ) : (
          <Tag
            color="red"
            style={{
              display: "flex",
              fontSize: 16,
              height: 40,
              alignItems: "center",
            }}
          >
            Not submitted
          </Tag>
        )}
      </MainHeading>

      <div className="mx-10">
        <section className="px-5">
          <h2 className="mb-4 text-3xl">Title</h2>
          <div className="markdown mb-5">
            <Typography.Title level={4}>{assignment?.name}</Typography.Title>
          </div>
        </section>
        <section className="px-5">
          <h2 className="mb-4 text-3xl">Description</h2>
          <div className="markdown mb-5 text-lg">
            <ReactMarkdown>{`${assignment?.description}`}</ReactMarkdown>
          </div>
          <div className="mb-5">
            <Typography.Title level={5}>
              Created at:{" "}
              <Typography.Text type="secondary">
                {dayjs(assignment?.createdAt).format("DD-MM-YYYY hh:mm A")}
              </Typography.Text>
            </Typography.Title>
          </div>
          <div className="mb-5">
            <Typography.Title level={5}>
              Last updated at:{" "}
              <Typography.Text type="success">
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
                  isLoadingAttachment={attachmentsQuery.isFetching}
                />
              }
              isLoading={attachmentsQuery.isLoading}
              data={attachmentsQuery.data}
            />
          </div>
          <div className="mb-5">
            <EmptyStateWrapper
              EmptyComponent={<EmptyStateAttachments isSubmissions />}
              NonEmptyComponent={
                <AttachmentsTable
                  type="Submission"
                  data={submissionQuery.data ?? []}
                  isLoadingSubmission={submissionQuery.isFetching}
                  onFilesDeleted={handleOnSubmissionDelete}
                />
              }
              isLoading={submissionQuery.isLoading}
              data={submissionQuery.data}
            />
          </div>
          {assignment?.status !== "completed" && (
            <div className="mb-8 flex w-1/4 items-start justify-between gap-4">
              <Upload {...uploadProps}>
                <Button
                  style={{ alignItems: "center", display: "flex" }}
                  icon={<UploadOutlined />}
                >
                  Select File
                </Button>
              </Upload>
              <Button
                type="primary"
                onClick={handleUpload}
                disabled={fileList.length === 0}
                loading={uploading}
              >
                {uploading ? "Uploading" : "Start Upload"}
              </Button>
            </div>
          )}
        </section>
      </div>
      <Drawer
        placement="right"
        onClose={onClose}
        open={open}
        title="Assignment comments"
      >
        <CommentDrawer assignmentId={assignmentId} />
      </Drawer>
    </section>
  );
};
