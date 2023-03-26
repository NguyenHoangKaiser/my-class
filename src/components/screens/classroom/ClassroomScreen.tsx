import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { useSession } from "src/hooks";
import { EmptyStateWrapper, MainHeading } from "src/components/common";
import { EyeIcon, PencilSquare, TrashIcon } from "src/components/common/Icons";
import Roles from "src/utils/constants";
import { trpc } from "src/utils/trpc";
import SideNavigation, { tabAtom } from "./SideNavigation";
import NoAssignments from "./NoAssignments";
import TeacherAssignments from "./TeacherAssignments";
import StudentAssignments from "./StudentAssignments";
import StudentsSection from "./StudentsSection";
import CreateAssignmentModal from "./CreateAssignmentModal";
import EditClassroomModal from "./EditClassroomModal";
import SubmissionsSection from "./SubmissionsSection";
import LinkButton from "src/components/common/Button/LinkButton";
import {
  Button,
  message,
  Popconfirm,
  Popover,
  Rate,
  Space,
  Typography,
} from "antd";
import { SmileOutlined } from "@ant-design/icons";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

function ClassroomScreen({ classroomId }: { classroomId: string }) {
  const [selectedTab] = useAtom(tabAtom);

  const assignmentsQuery = trpc.classroom.getAssignments.useQuery({
    classroomId,
  });

  const classroomQuery = trpc.classroom.getClassroom.useQuery({ classroomId });

  const classrooms = trpc.student.getClassrooms.useQuery();

  const unenrollMutation = trpc.classroom.unEnroll.useMutation();

  const deleteClassroom = trpc.classroom.deleteClassroom.useMutation();

  const deleteAssignment = trpc.assignment.deleteAssignment.useMutation();

  const rateClassroom = trpc.classroom.rateClassroom.useMutation();

  const handleDeleteAssignment = async (assignmentId: string) => {
    await deleteAssignment.mutateAsync({ assignmentId });
    message.success("Assignment deleted successfully!");
    assignmentsQuery.refetch();
  };

  const [showEditClassroomModal, setShowEditClassroomModal] =
    React.useState<boolean>(false);

  const [showCreateAssignmentModal, setShowCreateAssignmentModal] =
    React.useState<boolean>(false);

  const session = useSession();
  const router = useRouter();

  const isLoadingAssignments = assignmentsQuery.isLoading;
  const assignments = assignmentsQuery.data;
  const classroom = classroomQuery.data;
  const hasAdminAccess = classroom?.userId === session.data?.user?.id;
  const showUnenroll = classrooms.data?.some(({ id }) => id === classroomId);
  const hasRated = classroom?.ratings?.some(
    ({ studentId }) => studentId === session.data?.user?.id
  );

  const myRate = classroom?.ratings?.find(
    ({ studentId }) => studentId === session.data?.user?.id
  )?.amount;

  const handleRate = async (value: number) => {
    await rateClassroom.mutateAsync({ classroomId, amount: value });
    message.success("Rated classroom successfully!");
    classroomQuery.refetch();
  };

  const handleUnenroll = async () => {
    await unenrollMutation.mutateAsync(
      { classroomId },
      {
        onSuccess: () => {
          message.success("Unenrolled from classroom successfully!");
          router.push("/dashboard");
        },
        onError: () => {
          message.error("Something went wrong!");
        },
      }
    );
    router.push("/dashboard");
  };

  const handleDeleteClassroom = async () => {
    await deleteClassroom.mutateAsync(
      { classroomId },
      {
        onSuccess: () => {
          message.success("Classroom deleted successfully!");
          router.push("/classrooms");
        },
        onError: () => {
          message.error("Something went wrong!");
        },
      }
    );
  };

  const openAssignmentModal = () => {
    setShowCreateAssignmentModal(true);
  };

  return (
    <>
      <MainHeading title={classroom?.name ?? "loading..."}>
        {showUnenroll && !hasRated && (
          <Popover
            content={
              <span>
                <Rate tooltips={desc} onChange={handleRate} defaultValue={0} />
              </span>
            }
            title="Rate this classroom"
          >
            <Space>
              <Typography.Text>Like this class ?</Typography.Text>
              <SmileOutlined />
            </Space>
          </Popover>
        )}
        {hasRated && (
          <Rate tooltips={desc} onChange={handleRate} defaultValue={myRate} />
        )}
        {hasAdminAccess && (
          <div className="flex gap-3">
            <LinkButton
              onClick={() => router.push(`/classrooms/${classroomId}/overview`)}
            >
              <EyeIcon /> Overview
            </LinkButton>
            <LinkButton onClick={() => setShowEditClassroomModal(true)}>
              <PencilSquare /> Edit
            </LinkButton>
            <Popconfirm
              title="Delete classroom"
              placement="bottomRight"
              description="Are you sure to delete this classroom?"
              onConfirm={() => {
                handleDeleteClassroom();
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
        )}

        {showUnenroll && (
          <div className="flex gap-3">
            <LinkButton
              onClick={() => router.push(`/classrooms/${classroomId}/overview`)}
            >
              <EyeIcon /> Overview
            </LinkButton>
            <Popconfirm
              title="Unenroll from this classroom"
              placement="bottomRight"
              description="Are you sure to unenroll from this classroom?"
              onConfirm={() => {
                handleUnenroll();
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button className="mr-4" size="large" type="primary" danger>
                Unenroll
              </Button>
            </Popconfirm>
          </div>
        )}
      </MainHeading>

      <div className="mb-12 mr-7 flex">
        <SideNavigation />

        <section className="grow">
          {selectedTab === "assignments" && (
            <EmptyStateWrapper
              isLoading={isLoadingAssignments}
              data={assignments}
              EmptyComponent={
                <NoAssignments openAssignmentModal={openAssignmentModal} />
              }
              NonEmptyComponent={
                session.data?.user?.role === Roles.Teacher ? (
                  <TeacherAssignments
                    handleDeleteAssignment={handleDeleteAssignment}
                    assignments={assignments ?? []}
                    openAssignmentModal={openAssignmentModal}
                    classroom={classroom}
                  />
                ) : (
                  <StudentAssignments
                    classroom={classroom}
                    assignments={assignments ?? []}
                  />
                )
              }
            />
          )}

          {selectedTab === "students" && (
            <StudentsSection classroomId={classroomId} />
          )}

          {selectedTab === "submissions" && (
            <SubmissionsSection classroomId={classroomId} />
          )}
        </section>
      </div>

      <CreateAssignmentModal
        open={showCreateAssignmentModal}
        refetch={assignmentsQuery.refetch}
        onCancel={() => setShowCreateAssignmentModal(false)}
        classroom={classroom}
      />

      {classroom && (
        <EditClassroomModal
          onCancel={() => setShowEditClassroomModal(false)}
          refetch={classroomQuery.refetch}
          open={showEditClassroomModal}
          classroom={classroom}
        />
      )}
    </>
  );
}

export default ClassroomScreen;
