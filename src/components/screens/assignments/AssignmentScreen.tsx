import { DateTime } from "luxon";
import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Badge, MainHeading } from "src/components/common";
import { BadgeVariant } from "src/components/common/Badge";
import Button, { Variant } from "src/components/common/Button";
import { useFileUpload } from "src/hooks";
import { trpc } from "src/utils/trpc";

export const AssignmentScreen = ({
  assignmentId,
}: {
  assignmentId: string;
}) => {
  const assignmentQuery = trpc.classroom.getAssignment.useQuery({
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

  return (
    <section>
      <MainHeading
        title={`Assignment #${assignmentQuery.data?.number}`}
        subTitle={assignmentQuery.data?.name}
      >
        <>
          {isSubmissionSubmitted ? (
            <Badge variant={BadgeVariant.Success}>Submitted</Badge>
          ) : (
            <Badge variant={BadgeVariant.Error}>
              Due on {formattedDueDate}
            </Badge>
          )}

          <div className="flex justify-end place-self-end">
            <form className="text-white" onSubmit={uploadFile}>
              <label
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="file-upload"
              >
                Upload Assignment
              </label>
              <input
                ref={fileRef}
                id="file-upload"
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
                onChange={handleFileChange}
                type="file"
              />
              {file && (
                <Button
                  className="mt-4"
                  type="submit"
                  variant={Variant.Primary}
                >
                  Upload
                </Button>
              )}
            </form>
          </div>
        </>
      </MainHeading>

      <div className="markdown mb-12">
        <ReactMarkdown>{assignmentQuery.data?.description ?? ""}</ReactMarkdown>
      </div>
    </section>
  );
};
