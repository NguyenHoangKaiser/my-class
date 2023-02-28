import React from "react";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { useSession } from "src/hooks";
import { EmptyStateWrapper, MainHeading } from "src/components/common";
import { PencilSquare, TrashIcon } from "src/components/common/Icons";
import Button, { Variant } from "src/components/common/Button";
import Roles from "src/utils/constants";
import { trpc } from "src/utils/trpc";
import { useCreateAssignment } from "./hooks/useCreateAssignment";
import { useEditClassroom } from "./hooks/useEditClassroom";
import SideNavigation, { TabName, tabAtom } from "./SideNavigation";
import NoAssignments from "./NoAssignments";
import TeacherAssignments from "./TeacherAssignments";
import StudentAssignments from "./StudentAssignments";
import StudentsSection from "./StudentsSection";
import CreateAssignmentModal from "./CreateAssignmentModal";
import EditClassroomModal from "./EditClassroomModal";
import SubmissionsSection from "./SubmissionsSection";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";

function ClassroomScreen({ classroomId }: { classroomId: string }) {
  const [selectedTab] = useAtom(tabAtom);

  const assignmentsQuery = trpc.classroom.getAssignments.useQuery({
    classroomId,
  });

  const classroomQuery = trpc.classroom.getClassroom.useQuery({ classroomId });

  const classrooms = trpc.student.getClassrooms.useQuery();

  const unenrollMutation = trpc.classroom.unEnroll.useMutation();

  const deleteClassroom = trpc.classroom.deleteClassroom.useMutation();

  const {
    openEditClassroomModal,
    closeEditModal,
    handleEditClassroomComplete,
    showEditClassroomModal,
  } = useEditClassroom({
    refreshClassroom: classroomQuery.refetch,
    classroomId,
  });

  const {
    showCreateAssignmentModal,
    closeAssignmentModal,
    openAssignmentModal,
    handleAssignmentModalComplete,
  } = useCreateAssignment({
    classroomId,
  });

  const session = useSession();
  const router = useRouter();

  const isLoadingAssignments = assignmentsQuery.isLoading;
  const assignments = assignmentsQuery.data;
  const classroom = classroomQuery.data;
  const hasAdminAccess = classroom?.userId === session.data?.user?.id;
  const showUnenroll = classrooms.data?.some(({ id }) => id === classroomId);

  const handleUnenroll = async () => {
    if (confirm("are you sure you want to unenroll")) {
      await unenrollMutation.mutateAsync({ classroomId });
      router.push("/dashboard");
    }
  };

  const handleDeleteClassroom = async () => {
    if (!confirm("Confirm delete classroom?")) return;
    await deleteClassroom.mutateAsync({ classroomId });

    router.push("/classrooms");
  };

  return (
    <>
      <MainHeading title={classroom?.name ?? "loading..."}>
        {hasAdminAccess && (
          <div className="flex gap-3">
            <LinkButton className="text-base" onClick={openEditClassroomModal}>
              <PencilSquare /> Edit
            </LinkButton>
            <LinkButton
              className="text-base"
              onClick={handleDeleteClassroom}
              variant={LinkButtonVariant.Danger}
            >
              <TrashIcon /> Delete
            </LinkButton>
          </div>
        )}

        {showUnenroll && (
          <Button variant={Variant.Danger} onClick={handleUnenroll}>
            Unenroll
          </Button>
        )}
      </MainHeading>

      <div className="mb-12 flex">
        <SideNavigation />

        <section className="grow">
          {selectedTab === TabName.Assignment && (
            <EmptyStateWrapper
              isLoading={isLoadingAssignments}
              data={assignments}
              EmptyComponent={
                <NoAssignments openAssignmentModal={openAssignmentModal} />
              }
              NonEmptyComponent={
                session.data?.user?.role === Roles.Teacher ? (
                  <TeacherAssignments
                    classroomId={classroomId}
                    assignments={assignments ?? []}
                    openAssignmentModal={openAssignmentModal}
                  />
                ) : (
                  <StudentAssignments
                    classroomId={classroomId}
                    assignments={assignments ?? []}
                  />
                )
              }
            />
          )}

          {selectedTab === TabName.Students && (
            <StudentsSection classroomId={classroomId} />
          )}

          {selectedTab === TabName.Submissions && (
            <SubmissionsSection classroomId={classroomId} />
          )}
        </section>
      </div>

      <CreateAssignmentModal
        onCancel={closeAssignmentModal}
        onComplete={handleAssignmentModalComplete}
        isOpen={showCreateAssignmentModal}
        classroomId={classroomId}
      />

      {classroom && (
        <EditClassroomModal
          onCancel={closeEditModal}
          onComplete={handleEditClassroomComplete}
          isOpen={showEditClassroomModal}
          classroom={classroom}
        />
      )}
    </>
  );
}

export default ClassroomScreen;
