import { useForm } from "react-hook-form";
import Button, { Variant } from "src/components/common/Button";
import FormGroup from "src/components/common/Form/FormGroup";
import Modal, { ModalActions, ModalForm } from "src/components/common/Modal";
import { trpc } from "src/utils/trpc";

type CreateClassroomFormData = {
  name: string;
};

function CreateClassroomModal({
  onCancel,
  onComplete,
  isOpen,
}: {
  onCancel: () => void;
  onComplete: () => void;
  isOpen: boolean;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateClassroomFormData>();

  const createClassroom = trpc.classroom.createClassroom.useMutation();

  const onSubmit = handleSubmit(async (data) => {
    // await createClassroom.mutateAsync({ name: data.name });
    reset();
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
      title="Create a Class"
      description="Create a class to teach your students."
    >
      <ModalForm onSubmit={onSubmit}>
        <FormGroup
          label="Name"
          error={errors.name && "Name is required"}
          name="name"
        >
          <input id="name" {...register("name", { required: true })} />
        </FormGroup>

        <ModalActions>
          <Button
            onClick={handleCancel}
            type="button"
            variant={Variant.Secondary}
          >
            Cancel
          </Button>
          <Button type="submit" variant={Variant.Primary}>
            Create
          </Button>
        </ModalActions>
      </ModalForm>
    </Modal>
  );
}

export default CreateClassroomModal;
