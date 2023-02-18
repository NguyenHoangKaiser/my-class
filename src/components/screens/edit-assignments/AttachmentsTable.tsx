import type { Attachment } from "@prisma/client";
import { trpc } from "src/utils/trpc";
import Table from "src/components/common/Table";
import { DownloadIcon, TrashIcon } from "src/components/common/Icons";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import { supabase } from "src/libs/supabaseClient";
import { getKeyUrl } from "src/utils/helper";

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
    const { error } = await supabase.storage.from("files").remove([
      getKeyUrl({
        assignmentId: assignmentId,
        attachmentId: id,
        filename: filename,
      }),
    ]);
    if (error) {
      alert(error.message);
      console.log(error);
      return;
    }
    await deleteAttachment.mutateAsync({
      attachmentId: id,
    });
    onAttachmentDeleted();
  };

  //TODO: extract this to a helper function
  const getDownloadUrl = async ({
    attachmentId,
    filename,
    assignmentId,
  }: {
    attachmentId: string;
    filename: string;
    assignmentId: string;
  }) => {
    const { data } = await supabase.storage
      .from("files")
      .getPublicUrl(getKeyUrl({ assignmentId, attachmentId, filename }), {
        download: true,
      });

    if (data) {
      window.open(data.publicUrl, "_blank", "noopener,noreferrer");
    }
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
