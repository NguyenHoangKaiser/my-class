import type { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { MainHeading } from "src/components/common";
import Alert, { useDismissible } from "src/components/common/Alert";
import Button from "src/components/common/Button";
import FormGroup from "src/components/common/Form/FormGroup";
import HeaderLayout from "src/layouts/HeaderLayout";
import { trpc } from "src/utils/trpc";

type FormData = {
  displayName: string;
};

export const ProfileScreen = () => {
  const { dismiss, show, isDisplayed } = useDismissible();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const updateDisplayName = trpc.user.updateDisplayName.useMutation();

  trpc.user.getUser.useQuery(undefined, {
    onSuccess(userData: User) {
      setValue("displayName", userData.displayName ?? userData.name ?? "");
    },
  });

  const queryClient = trpc.useContext();

  const handleProfileSubmit = async (data: FormData) => {
    await updateDisplayName.mutateAsync({
      displayName: data.displayName,
    });
    queryClient.user.getUser.invalidate();
    show();
  };

  return (
    <HeaderLayout>
      <MainHeading title="Your Profile" />

      {isDisplayed && (
        <Alert
          message="Your profile has been successfully updated."
          onClose={dismiss}
        />
      )}

      <h2 className="mb-4 text-2xl">Settings</h2>

      <form onSubmit={handleSubmit(handleProfileSubmit)} className="w-1/3">
        <FormGroup
          label="Display Name"
          error={errors.displayName && "Display name is required"}
          name="displayName"
        >
          <>
            <input
              id="displayName"
              className="mb-2"
              {...register("displayName", { required: true })}
            />
            <Button
              isLoading={updateDisplayName.isLoading}
              className="self-end"
            >
              Update
            </Button>
          </>
        </FormGroup>
      </form>
    </HeaderLayout>
  );
};
