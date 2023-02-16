import type { Attachment } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import Table from "src/components/common/Table";
import { DownloadIcon, TrashIcon } from "src/components/common/Icons";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";

function AttachmentsTable({
  attachments,
  onAttachmentDeleted,
}: {
  attachments: Attachment[];
  onAttachmentDeleted: () => void;
}) {
  const deleteAttachment = trpc.assignment.deleteAttachment.useMutation();

  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!confirm("are you sure?")) return;
    await deleteAttachment.mutateAsync({
      attachmentId,
    });
    onAttachmentDeleted();
  };

  return (
    <Table
      headers={["Filename", "Actions"]}
      rows={attachments.map((attachment) => [
        attachment.filename,
        <span key={attachment.id} className="flex items-center gap-4">
          <a
            className="link flex gap-2"
            target="_blank"
            href={`/api/download-attachment?attachmentId=${attachment.id}`}
            download={attachment.filename}
            rel="noreferrer"
          >
            <DownloadIcon />
            Download
          </a>
          <LinkButton
            variant={LinkButtonVariant.Danger}
            onClick={() => handleDeleteAttachment(attachment.id)}
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
