import React from "react";
import { trpc } from "src/utils/trpc";
// import { Button, Variant } from "../../common/Button/Button";
// import { EmptyStateWrapper } from "../../common/EmptyStateWrapper";
// import { MainHeading } from "../../common/MainHeading";
// import { AttachmentsTable } from "./AttachmentsTable";
// import { EmptyStateAttachments } from "./EmptyStateAttachments";
import { DateTime } from "luxon";
// import { Badge, BadgeVariant } from "../../common/Badge";
import { useForm } from "react-hook-form";
// import { PencilSquare } from "../../common/Icons/PencilSquare";
// import { LinkButton, LinkButtonVariant } from "../../common/Button/LinkButton";
import { useToggle } from "react-use";
// import { UploadIcon } from "../../common/Icons/UploadIcon";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import { useIsClassroomAdmin } from "src/hooks";
// import { TrashIcon } from "../../common/Icons/TrashIcon";
// import { FormGroup } from "../../common/Form/FormGroup/FormGroup";
// import { EditDateModal } from "./EditDateModal";
import { useFileUpload } from "./hooks/useFileUpload";
import { Badge, EmptyStateWrapper, MainHeading } from "src/components/common";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import {
  PencilSquare,
  TrashIcon,
  UploadIcon,
} from "src/components/common/Icons";
import FormGroup from "src/components/common/Form/FormGroup";
import Button, { Variant } from "src/components/common/Button";
import { BadgeVariant } from "src/components/common/Badge";
import EmptyStateAttachments from "./EmptyStateAttachments";
import AttachmentsTable from "./AttachmentsTable";
import EditDateModal from "./EditDateModal";
import { supabase } from "src/libs/supabaseClient";
// import { useIsClassroomAdmin } from "../../../hooks/useIsClassAdmin";

type UpdateDescriptionForm = {
  description: string;
};

type UpdateTitleForm = {
  title: string;
};

export const EditAssignmentScreen = ({
  classroomId,
  assignmentId,
}: {
  classroomId: string;
  assignmentId: string;
}) => {
  const [isEditingDescription, toggleIsEditingDescription] = useToggle(false);
  const [isEditingTitle, toggleIsEditingTitle] = useToggle(false);
  const [isEditDueDateModalOpen, toggleIsEditDueDateModalOpen] =
    useToggle(false);
  const { register, handleSubmit, setValue } = useForm<UpdateDescriptionForm>();
  const {
    register: registerTitle,
    handleSubmit: handleSubmitTitle,
    setValue: setValueTitle,
  } = useForm<UpdateTitleForm>();
  const router = useRouter();

  useIsClassroomAdmin(classroomId);
  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  // const {data, error} = await supabase.storage.from('files').upload(`assignments/${assignmentId}/${att}/${file.name}`, file);
  const createPresignedUrl = trpc.assignment.createPresignedUrl.useMutation();

  const { file, fileRef, handleFileChange, uploadFile } = useFileUpload({
    getUploadUrl: (fileToUpload: File) =>
      createPresignedUrl.mutateAsync({
        filename: fileToUpload.name,
        assignmentId,
      }),
    onFileUploaded: () => {
      attachmentsQuery.refetch();
    },
  });

  const deleteAssignment = trpc.assignment.deleteAssignment.useMutation();

  const updateDescription = trpc.assignment.updateDescription.useMutation();

  const updateTitle = trpc.assignment.updateTitle.useMutation();

  const attachmentsQuery = trpc.assignment.getAttachments.useQuery({
    assignmentId,
  });

  const assignmentQuery = trpc.classroom.getAssignment.useQuery(
    {
      assignmentId,
    },
    {
      refetchOnWindowFocus: false,
      onSuccess(data) {
        setValue("description", data?.description ?? "");
        setValueTitle("title", data?.name ?? "");
      },
    }
  );

  const handleSaveEditDescription = async (formData: UpdateDescriptionForm) => {
    await updateDescription.mutateAsync({
      description: formData.description,
      assignmentId,
    });
    assignmentQuery.refetch();
    toggleIsEditingDescription();
  };

  const handleSaveEditTitle = async (formData: UpdateTitleForm) => {
    await updateTitle.mutateAsync({
      title: formData.title,
      assignmentId,
    });
    assignmentQuery.refetch();
    toggleIsEditingTitle();
  };

  const handleDeleteAssignment = async () => {
    if (!confirm("are you sure?")) return;
    await deleteAssignment.mutateAsync({ assignmentId });
    router.push(`/classrooms/${classroomId}`);
  };

  const handleOnAttachmentDelete = () => {
    attachmentsQuery.refetch();
  };

  const formattedDueDate = assignmentQuery.data?.dueDate
    ? DateTime.fromISO(assignmentQuery.data?.dueDate).toLocaleString(
        DateTime.DATE_MED
      )
    : "N/A";

  const assignment = assignmentQuery.data;

  return (
    <>
      <MainHeading title={`Edit Assignment #${assignment?.number}`}>
        <Badge variant={BadgeVariant.Error} className="flex items-center gap-4">
          Due on {formattedDueDate}
          <LinkButton
            onClick={toggleIsEditDueDateModalOpen}
            variant={LinkButtonVariant.Secondary}
          >
            <PencilSquare /> Edit
          </LinkButton>
        </Badge>

        <LinkButton
          variant={LinkButtonVariant.Danger}
          onClick={handleDeleteAssignment}
        >
          <TrashIcon /> Delete
        </LinkButton>
      </MainHeading>

      <section className="px-5">
        <h2 className="mb-4 flex items-center gap-4 text-4xl">
          Title
          <LinkButton onClick={toggleIsEditingTitle}>
            <PencilSquare /> Edit
          </LinkButton>
        </h2>
        {isEditingTitle ? (
          <form
            className="mb-12 flex w-2/3 flex-col"
            onSubmit={handleSubmitTitle(handleSaveEditTitle)}
          >
            <FormGroup label="Title" name="title">
              <input className="mb-4" {...registerTitle("title")}></input>
            </FormGroup>

            <div className="flex justify-end">
              <Button className="w-fit">
                <UploadIcon size="md" /> Save
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-md mb-12 flex items-center gap-4">
            {assignmentQuery.data?.name}
          </p>
        )}
      </section>

      <section className="px-5">
        <h2 className="mb-4 flex text-3xl">
          Description
          <LinkButton onClick={toggleIsEditingDescription}>
            <PencilSquare /> Edit
          </LinkButton>
        </h2>

        {isEditingDescription ? (
          <form
            className="mb-12 flex w-2/3 flex-col"
            onSubmit={handleSubmit(handleSaveEditDescription)}
          >
            <FormGroup label="Description" name="description">
              <textarea
                className="mb-4 h-56"
                {...register("description")}
              ></textarea>
            </FormGroup>

            <div className="flex justify-end">
              <Button className="w-fit">
                <UploadIcon size="md" /> Save
              </Button>
            </div>
          </form>
        ) : (
          <div className="markdown mb-12">
            <ReactMarkdown>{assignment?.description ?? ""}</ReactMarkdown>
          </div>
        )}

        <h2 className="mb-4 text-3xl">Attachments</h2>

        <div className="mb-8">
          <EmptyStateWrapper
            EmptyComponent={<EmptyStateAttachments />}
            NonEmptyComponent={
              <AttachmentsTable
                onAttachmentDeleted={handleOnAttachmentDelete}
                attachments={attachmentsQuery.data ?? []}
              />
            }
            isLoading={attachmentsQuery.isLoading}
            data={attachmentsQuery.data}
          />
        </div>

        <div className="mb-6 flex justify-start">
          <form className="text-white" onSubmit={uploadFile}>
            <label htmlFor="file-upload">Upload Attachment</label>
            <input
              ref={fileRef}
              id="file-upload"
              className="ml-4 text-white"
              onChange={handleFileChange}
              type="file"
            />
            {file && (
              <Button className="ml-4" type="submit" variant={Variant.Primary}>
                Upload
              </Button>
            )}
          </form>
        </div>
      </section>

      {assignmentQuery.data?.dueDate && (
        <EditDateModal
          initialDueDate={assignmentQuery.data.dueDate}
          assignmentId={assignmentId}
          isOpen={isEditDueDateModalOpen}
          onCancel={toggleIsEditDueDateModalOpen}
          onComplete={() => {
            toggleIsEditDueDateModalOpen();
            assignmentQuery.refetch();
          }}
        />
      )}
    </>
  );
};
