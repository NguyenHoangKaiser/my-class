import React from "react";
import ReactMarkdown from "react-markdown";
import { EmptyStateWrapper, MainHeading } from "src/components/common";
import Button, { Variant } from "src/components/common/Button";
import { useFileUpload } from "src/hooks";
import { trpc } from "src/utils/trpc";
import AttachmentsTable from "../edit-assignments/AttachmentsTable";
import EmptyStateAttachments from "../edit-assignments/EmptyStateAttachments";
import { Tag, Typography } from "antd";
import dayjs from "dayjs";

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

  const { file, fileRef, handleFileChange, uploadFile } = useFileUpload({
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
        {/* {submissionQuery.data && submissionQuery.data.length > 0 ? (
          <Badge variant={BadgeVariant.Success}>Submitted</Badge>
        ) : (
          <Badge variant={BadgeVariant.Error}>Due on {formattedDueDate}</Badge>
        )} */}
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
            color={
              assignment?.status === "progressing"
                ? "green"
                : assignment?.status === "suspended"
                ? "orange"
                : "red"
            }
            style={{
              display: "flex",
              fontSize: 16,
              height: 40,
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            {assignment?.status.toUpperCase()}
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
                <AttachmentsTable data={attachmentsQuery.data ?? []} />
              }
              isLoading={attachmentsQuery.isLoading}
              data={attachmentsQuery.data}
            />
          </div>
          <div className="mb-8 flex w-1/4 items-start justify-between gap-4">
            {/* <Upload {...uploadProps}>
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
              // style={{ marginTop: 16 }}
            >
              {uploading ? "Uploading" : "Start Upload"}
            </Button> */}
          </div>
          <h2 className="mb-5 text-3xl">Submissions</h2>
          <div className="mb-5">
            <EmptyStateWrapper
              EmptyComponent={<EmptyStateAttachments />}
              NonEmptyComponent={
                <AttachmentsTable
                  data={submissionQuery.data ?? []}
                  onFilesDeleted={handleOnSubmissionDelete}
                />
              }
              isLoading={submissionQuery.isLoading}
              data={submissionQuery.data}
            />
          </div>
          <div className="mb-8 flex w-1/4 items-start justify-between gap-4">
            {/* <Upload {...uploadProps}>
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
              // style={{ marginTop: 16 }}
            >
              {uploading ? "Uploading" : "Start Upload"}
            </Button> */}
          </div>
        </section>
      </div>

      <div className="flex px-5">
        <form className="text-white" onSubmit={uploadFile}>
          <label
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file-upload"
          >
            Upload Submissions
          </label>
          <input
            ref={fileRef}
            id="file-upload"
            className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
            onChange={handleFileChange}
            type="file"
          />
          {file && (
            <Button className="mt-4" type="submit" variant={Variant.Primary}>
              Upload
            </Button>
          )}
        </form>
      </div>
    </section>
  );
};
