import React from "react";
import { useForm } from "react-hook-form";
import { trpc } from "src/utils/trpc";
import { DateTime, Duration } from "luxon";
import Modal, { ModalActions, ModalForm } from "src/components/common/Modal";
import FormGroup from "src/components/common/Form/FormGroup";
import Button, { Variant } from "src/components/common/Button";

type CreateAssignmentForm = {
  name: string;
  description: string;
  dueDate: string;
};

function CreateAssignmentModal({
  onCancel,
  onComplete,
  isOpen,
  classroomId,
}: {
  onCancel: () => void;
  onComplete: (assignmentId: string) => void;
  isOpen: boolean;
  classroomId: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateAssignmentForm>();

  const createAssignment = trpc.classroom.createAssignment.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    const dur = Duration.fromObject({ day: 1, seconds: -1 }); // TODO: this seems like backend business logic
    const assignment = await createAssignment.mutateAsync({
      name: data.name,
      classroomId,
      dueDate: DateTime.fromISO(data.dueDate).plus(dur).toISO(),
    });
    reset();
    onComplete(assignment.id);
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  return (
    <Modal
      isOpen={isOpen}
      handleCancel={handleCancel}
      title="Create Assignment"
      description="Enter the information for your new assignment."
    >
      <ModalForm onSubmit={onSubmit}>
        <FormGroup
          label="Name"
          error={errors.name && "Name is required"}
          name="name"
        >
          <input id="name" {...register("name", { required: true })} />
        </FormGroup>

        <FormGroup
          label="Due Date"
          error={errors.dueDate && "Due date is required"}
          name="dueDate"
        >
          <input
            type="date"
            id="dueDate"
            {...register("dueDate", { required: true })}
          />
        </FormGroup>

        <ModalActions>
          <Button
            variant={Variant.Secondary}
            onClick={handleCancel}
            type="button"
          >
            Cancel
          </Button>
          <Button onClick={onSubmit} variant={Variant.Primary} type="submit">
            Create
          </Button>
        </ModalActions>
      </ModalForm>
    </Modal>
  );
}

export default CreateAssignmentModal;
