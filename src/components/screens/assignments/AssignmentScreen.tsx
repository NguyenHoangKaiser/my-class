import { CommentOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Row,
  Skeleton,
  Space,
  Tag,
  Typography,
  Upload,
} from "antd";
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
    <Row>
      <Col span={24}>
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
          {assignmentQuery.isLoading ? (
            <Skeleton.Input active size="large" />
          ) : (
            <>
              {submissionQuery.data && submissionQuery.data.length > 0 ? (
                <Tag
                  color="green"
                  style={{
                    display: "flex",
                    fontSize: "1rem",
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
                    fontSize: "1rem",
                    height: 40,
                    alignItems: "center",
                  }}
                >
                  Not submitted
                </Tag>
              )}
            </>
          )}
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
                marginBottom: 20,
              }}
            />
            <Skeleton
              paragraph={{
                rows: 1,
                width: "10%",
              }}
              title={false}
              active
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
              <div className="markdown mb-5">
                <Typography.Title level={4}>
                  {assignment?.name}
                </Typography.Title>
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
                      isLoadingAttachment={attachmentsQuery.isInitialLoading}
                    />
                  }
                  isLoading={attachmentsQuery.isInitialLoading}
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
                      isLoadingSubmission={submissionQuery.isInitialLoading}
                      onFilesDeleted={handleOnSubmissionDelete}
                    />
                  }
                  isLoading={submissionQuery.isInitialLoading}
                  data={submissionQuery.data}
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
                  <Button
                    type="primary"
                    style={{
                      position: "absolute",
                      left: 150,
                      top: 0,
                    }}
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
        )}
        <Drawer
          placement="right"
          onClose={onClose}
          open={open}
          title="Assignment comments"
        >
          <CommentDrawer assignmentId={assignmentId} />
        </Drawer>
      </Col>
    </Row>
  );
};
