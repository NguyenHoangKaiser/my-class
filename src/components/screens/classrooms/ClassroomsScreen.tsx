import { useState } from "react";
import { EmptyStateWrapper, MainHeading } from "src/components/common";
import { trpc } from "src/utils/trpc";
import EmptyStateClassrooms from "./EmptyStateClassrooms";
import ClassroomsList from "./ClassroomList";
import CreateClassroomModal from "./CreateClassroomModal";
import { Button } from "antd";
import { useRouter } from "next/router";

function ClassroomsScreen() {
  const [showCreateClassroomModal, setShowCreateClassroomModal] =
    useState(false);
  const router = useRouter();

  const {
    data: classrooms,
    isLoading,
    refetch: refetchClassrooms,
  } = trpc.classroom.getClassroomsForTeacher.useQuery();

  const closeClassroomModal = () => {
    setShowCreateClassroomModal(false);
  };

  const openClassroomModal = () => {
    setShowCreateClassroomModal(true);
  };

  const handleClassroomModalComplete = () => {
    refetchClassrooms();
    closeClassroomModal();
  };

  return (
    <>
      <MainHeading title={"My Classrooms"}>
        <Button
          type="primary"
          size="large"
          onClick={() => router.push("/classrooms/create-classroom")}
        >
          Create a Class
        </Button>
      </MainHeading>

      <div>
        <EmptyStateWrapper
          isLoading={isLoading}
          data={classrooms}
          EmptyComponent={
            <EmptyStateClassrooms openClassroomModal={openClassroomModal} />
          }
          NonEmptyComponent={<ClassroomsList classrooms={classrooms ?? []} />}
        />
      </div>

      <CreateClassroomModal
        onCancel={closeClassroomModal}
        onComplete={handleClassroomModalComplete}
        isOpen={showCreateClassroomModal}
      />
    </>
  );
}

export default ClassroomsScreen;
