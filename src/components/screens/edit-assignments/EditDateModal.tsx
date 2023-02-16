import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "src/utils/trpc";
import { DateTime, Duration } from "luxon";
import { Modal } from "src/components/common";
import { ModalActions, ModalForm } from "src/components/common/Modal";
import FormGroup from "src/components/common/Form/FormGroup";
import Button, { Variant } from "src/components/common/Button";

type EditDateForm = {
  dueDate: string;
};

function EditDateModal({
  onCancel,
  initialDueDate,
  onComplete,
  isOpen,
  assignmentId,
}: {
  initialDueDate: string;
  onCancel: () => void;
  onComplete: () => void;
  isOpen: boolean;
  assignmentId: string;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditDateForm>();

  useEffect(() => {
    reset({
      dueDate: DateTime.fromISO(initialDueDate).toFormat("yyyy-MM-dd"),
    });
  }, [initialDueDate, reset]);

  const updateDueDate = trpc.assignment.updateDueDate.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    const dur = Duration.fromObject({ day: 1, seconds: -1 }); // TODO: this seems like backend business logic
    await updateDueDate.mutateAsync({
      assignmentId,
      dueDate: DateTime.fromISO(data.dueDate).plus(dur).toISO(),
    });
    onComplete();
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
            Update
          </Button>
        </ModalActions>
      </ModalForm>
    </Modal>
  );
}
export default EditDateModal;
