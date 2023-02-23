import type { Attachment } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import Table from "src/components/common/Table";
import { DownloadIcon, TrashIcon } from "src/components/common/Icons";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import { getDownloadUrl, supabaseDeleteFile } from "src/utils/helper";

function AttachmentsTable({
  attachments,
  onAttachmentDeleted,
}: {
  attachments: Attachment[];
  onAttachmentDeleted: () => void;
}) {
  const deleteAttachment = trpc.assignment.deleteAttachment.useMutation();

  const handleDeleteAttachment = async ({
    id,
    filename,
    assignmentId,
  }: Attachment) => {
    if (!confirm("Confirm delete attachment ?")) return;
    supabaseDeleteFile({ assignmentId, attachmentId: id, filename });
    await deleteAttachment.mutateAsync({
      attachmentId: id,
    });
    onAttachmentDeleted();
  };

  return (
    <Table
      headers={["Filename", "Actions"]}
      rows={attachments.map((attachment) => [
        attachment.filename,
        <span key={attachment.id} className="flex items-center gap-4">
          <LinkButton
            variant={LinkButtonVariant.Primary}
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
          <LinkButton
            variant={LinkButtonVariant.Danger}
            onClick={() => handleDeleteAttachment(attachment)}
          >
            <TrashIcon />
            Delete
          </LinkButton>
        </span>,
      ])}
    ></Table>
  );
}

export default AttachmentsTable;
