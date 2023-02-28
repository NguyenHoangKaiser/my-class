import type { Attachment, Submission } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import Table from "src/components/common/Table";
import { DownloadIcon, TrashIcon } from "src/components/common/Icons";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import { getDownloadUrl } from "src/utils/helper";

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
    if (!confirm("Confirm delete file ?")) return;
    if (isSubmission(data)) {
      await deleteSubmission.mutateAsync({
        submissionId: data.id,
      });
    } else {
      await deleteAttachment.mutateAsync({
        attachmentId: data.id,
      });
    }
    onFilesDeleted?.();
  };

  if (isSubmissionArray(data)) {
    return (
      <Table
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
      <Table
        headers={["Filename", "Actions"]}
        rows={data.map((attachment) => [
          attachment.filename,
          <span key={attachment.id} className="flex items-center gap-4">
            <LinkButton
              variant={LinkButtonVariant.Primary}
              className="pl-0"
              onClick={() =>
                getDownloadUrl({
                  attachmentId: attachment.id,
                  filename: attachment.filename,
                  assignmentId: attachment.assignmentId,
                })
              }
            >
              <DownloadIcon /> Download
            </LinkButton>
            {onFilesDeleted && (
              <LinkButton
                variant={LinkButtonVariant.Danger}
                onClick={() => handleDeleteFile(attachment)}
              >
                <TrashIcon />
                Delete
              </LinkButton>
            )}
          </span>,
        ])}
      />
    );
  }
}

export default AttachmentsTable;
