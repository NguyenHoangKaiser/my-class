import { useState } from "react";
import { trpc } from "src/utils/trpc";

type EditClassroomInput = {
  refreshClassroom: () => void;
  classroomId: string;
};

type UpdatedClassroomData = {
  name: string;
  description: string;
};

export const useEditClassroom = ({
  refreshClassroom,
  classroomId,
}: EditClassroomInput) => {
  const [showEditClassroomModal, setShowEditClassroomModal] = useState(false);

  const editClassroomMutation = trpc.classroom.editClassroom.useMutation();

  const openEditClassroomModal = () => {
    setShowEditClassroomModal(true);
  };

  const closeEditModal = () => {
    setShowEditClassroomModal(false);
  };

  const handleEditClassroomComplete = async (
    updatedClassroomData: UpdatedClassroomData
  ) => {
    await editClassroomMutation.mutateAsync({
      ...updatedClassroomData,
      classroomId,
    });
    refreshClassroom();
    setShowEditClassroomModal(false);
  };

  return {
    openEditClassroomModal,
    closeEditModal,
    handleEditClassroomComplete,
    showEditClassroomModal,
  };
};
