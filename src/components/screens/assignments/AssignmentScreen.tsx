import { DateTime } from "luxon";
import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Badge, EmptyStateWrapper, MainHeading } from "src/components/common";
import { BadgeVariant } from "src/components/common/Badge";
import Button, { Variant } from "src/components/common/Button";
import { useFileUpload } from "src/hooks";
import { trpc } from "src/utils/trpc";
import AttachmentsTable from "../edit-assignments/AttachmentsTable";
import EmptyStateAttachments from "../edit-assignments/EmptyStateAttachments";

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

  const formattedDueDate = assignmentQuery.data?.dueDate
    ? DateTime.fromISO(assignmentQuery.data?.dueDate).toLocaleString(
        DateTime.DATE_MED
      )
    : "N/A";

  const isSubmissionSubmitted = !!submissionQuery.data;

  const handleOnAttachmentDelete = () => {
    submissionQuery.refetch();
  };

  return (
    <section>
      <MainHeading
        title={`Assignment #${assignmentQuery.data?.number}`}
        subTitle={assignmentQuery.data?.name}
      >
        {isSubmissionSubmitted ? (
          <Badge variant={BadgeVariant.Success}>Submitted</Badge>
        ) : (
          <Badge variant={BadgeVariant.Error}>Due on {formattedDueDate}</Badge>
        )}
      </MainHeading>

      <div className="markdown mb-12 px-5">
        <ReactMarkdown>{assignmentQuery.data?.description ?? ""}</ReactMarkdown>
      </div>

      <div className="mb-8 px-5">
        <h2 className="px mb-5 text-2xl">Attachments</h2>
        <EmptyStateWrapper
          EmptyComponent={<EmptyStateAttachments isSubmissions={true} />}
          NonEmptyComponent={
            <AttachmentsTable data={attachmentsQuery.data ?? []} />
          }
          isLoading={attachmentsQuery.isLoading}
          data={attachmentsQuery.data}
        />
      </div>

      <div className="mb-8 px-5">
        <h2 className="px mb-5 text-2xl">Submission</h2>
        <EmptyStateWrapper
          EmptyComponent={<EmptyStateAttachments />}
          NonEmptyComponent={
            <AttachmentsTable
              data={submissionQuery.data ?? []}
              onFilesDeleted={handleOnAttachmentDelete}
            />
          }
          isLoading={submissionQuery.isLoading}
          data={submissionQuery.data}
        />
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
