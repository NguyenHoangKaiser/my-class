import { EditOutlined, InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Tag, Typography, Upload, UploadProps, Button } from "antd";
import { RcFile, UploadFile } from "antd/es/upload";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useToggle } from "react-use";
import { Badge, EmptyStateWrapper, MainHeading } from "src/components/common";
import { BadgeVariant } from "src/components/common/Badge";
// import Button, { Variant } from "src/components/common/Button";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import { PencilSquare, TrashIcon } from "src/components/common/Icons";
import { useFileUpload, useIsClassroomAdmin } from "src/hooks";
import { trpc } from "src/utils/trpc";
import AttachmentsTable from "./AttachmentsTable";
import EditAssignmentModal from "./EditAssignmentModal";
import EditDateModal from "./EditDateModal";
import EmptyStateAttachments from "./EmptyStateAttachments";

export const EditAssignmentScreen = ({
  classroomId,
  assignmentId,
}: {
  classroomId: string;
  assignmentId: string;
}) => {
  const [showEditAssignmentModal, setShowEditAssignmentModal] =
    React.useState<boolean>(false);
  const [isEditDueDateModalOpen, toggleIsEditDueDateModalOpen] =
    useToggle(false);

  const classroomQuery = trpc.classroom.getClassroom.useQuery({ classroomId });

  const router = useRouter();

  useIsClassroomAdmin(classroomId);
  const createFileUrl = trpc.assignment.createFileUrl.useMutation();

  const { file, fileRef, handleFileChange, uploadFile } = useFileUpload({
    getUploadUrl: (fileToUpload: File) =>
      createFileUrl.mutateAsync({
        filename: fileToUpload.name,
        assignmentId,
      }),
    onFileUploaded: () => {
      attachmentsQuery.refetch();
    },
  });

  const deleteAssignment = trpc.assignment.deleteAssignment.useMutation();

  const attachmentsQuery = trpc.assignment.getAttachments.useQuery({
    assignmentId,
  });

  const assignmentQuery = trpc.classroom.getAssignment.useQuery({
    assignmentId,
  });

  const handleDeleteAssignment = async () => {
    if (!confirm("Confirm delete assignment?")) return;
    await deleteAssignment.mutateAsync({ assignmentId });

    router.push(`/classrooms/${classroomId}`);
  };

  const handleOnAttachmentDelete = () => {
    attachmentsQuery.refetch();
  };

  const formattedDueDate = assignmentQuery.data?.dueDate
    ? dayjs(assignmentQuery.data?.dueDate).format("DD-MM-YYYY hh:mm A")
    : "N/A";

  const isNotDue = assignmentQuery.data?.dueDate
    ? dayjs().isBefore(assignmentQuery.data?.dueDate)
    : false;

  const assignment = assignmentQuery.data;

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("files[]", file as RcFile);
    });
    setUploading(true);
    console.log("fileList", fileList);

    // You can use any AJAX library you like
    // fetch("https://www.mocky.io/v2/5cc8019d300000980a055e76", {
    //   method: "POST",
    //   body: formData,
    // })
    //   .then((res) => res.json())
    //   .then(() => {
    //     setFileList([]);
    //     message.success("upload successfully.");
    //   })
    //   .catch(() => {
    //     message.error("upload failed.");
    //   })
    //   .finally(() => {
    //     setUploading(false);
    //   });
  };

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  return (
    <>
      <MainHeading
        titleStyle="text-primary-700 dark:text-primary-500"
        title="Assignment details"
      >
        <div className="flex gap-4">
          {assignment?.status !== "completed" ? (
            <Tag
              color={isNotDue ? "green" : "red"}
              className="cursor-pointer"
              onClick={() => toggleIsEditDueDateModalOpen()}
              icon={<EditOutlined />}
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
          ) : (
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
          )}
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

        <div className="flex gap-3">
          <LinkButton onClick={() => setShowEditAssignmentModal(true)}>
            <PencilSquare /> Edit
          </LinkButton>
          <LinkButton
            variant={LinkButtonVariant.Danger}
            onClick={handleDeleteAssignment}
          >
            <TrashIcon /> Delete
          </LinkButton>
        </div>
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
          <h2 className="mb-5 text-3xl">Attachments</h2>
          <div className="mb-5">
            <EmptyStateWrapper
              EmptyComponent={<EmptyStateAttachments />}
              NonEmptyComponent={
                <AttachmentsTable
                  data={attachmentsQuery.data ?? []}
                  onFilesDeleted={handleOnAttachmentDelete}
                />
              }
              isLoading={attachmentsQuery.isLoading}
              data={attachmentsQuery.data}
            />
          </div>
          <div className="mb-14 flex justify-start">
            {/* <form className="text-white" onSubmit={uploadFile}>
              <label
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="file-upload"
              >
                Upload Attachment
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
            </form> */}
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <Button
              type="primary"
              onClick={handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              style={{ marginTop: 16 }}
            >
              {uploading ? "Uploading" : "Start Upload"}
            </Button>
          </div>
        </section>
      </div>

      {assignmentQuery.data?.dueDate && (
        <EditDateModal
          open={isEditDueDateModalOpen}
          refetch={assignmentQuery.refetch}
          onCancel={() => toggleIsEditDueDateModalOpen(false)}
          assignment={assignment}
        />
      )}

      <EditAssignmentModal
        open={showEditAssignmentModal}
        refetch={assignmentQuery.refetch}
        classroom={classroomQuery.data}
        onCancel={() => setShowEditAssignmentModal(false)}
        assignment={assignment}
      />
    </>
  );
};
