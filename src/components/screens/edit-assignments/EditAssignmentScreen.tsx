import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Tag, Typography, Upload, Button, Popconfirm, message } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useToggle } from "react-use";
import { EmptyStateWrapper, MainHeading } from "src/components/common";
import LinkButton from "src/components/common/Button/LinkButton";
import { PencilSquare, TrashIcon } from "src/components/common/Icons";
import { useIsClassroomAdmin } from "src/hooks";
import { trpc } from "src/utils/trpc";
import AttachmentsTable from "./AttachmentsTable";
import EditAssignmentModal from "./EditAssignmentModal";
import EditDateModal from "./EditDateModal";
import EmptyStateAttachments from "./EmptyStateAttachments";
import useAntUpload from "src/hooks/useAntUpload";

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

  const { fileList, handleUpload, uploadProps, uploading } = useAntUpload({
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
    await deleteAssignment.mutateAsync({ assignmentId });
    message.success("Assignment deleted successfully!");
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
          <Popconfirm
            title="Delete assignment"
            placement="bottomRight"
            description="Are you sure to delete this assignment?"
            onConfirm={() => {
              handleDeleteAssignment();
            }}
            okText="Yes"
            cancelText="No"
          >
            <Typography.Link
              href="#"
              type="danger"
              className="flex items-center gap-1"
            >
              <TrashIcon /> Delete
            </Typography.Link>
          </Popconfirm>
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
          <div className="mb-8 flex w-1/4 items-start justify-between gap-4">
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
              onClick={handleUpload}
              disabled={fileList.length === 0}
              loading={uploading}
              // style={{ marginTop: 16 }}
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
