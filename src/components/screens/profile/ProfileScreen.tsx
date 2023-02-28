import type { Classroom, Submission, User } from "@prisma/client";
import React from "react";
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

function ProfileScreen() {
  const { dismiss, show, isDisplayed } = useDismissible();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const updateDisplayName = trpc.user.updateDisplayName.useMutation();

  const { data: userData } = trpc.user.getUser.useQuery(undefined, {
    onSuccess(
      userData: User & {
        enrolledIn: Classroom[];
        submissions: Submission[];
      }
    ) {
      setValue("displayName", userData.displayName ?? userData.name ?? "");
    },
  });

  //This function can be expensive, so we only want to run it when the data changes
  const averageGrade = React.useMemo(() => {
    if (!userData || userData.submissions.length === 0) {
      return "N/A";
    }
    return userData.submissions.reduce(
      (acc, submission) =>
        //@ts-expect-error - Grade can be null
        acc + submission?.grade / userData.submissions.length,
      0
    );
  }, [userData]);

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

      <section className="px-5">
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
                className="self-start"
              >
                Update
              </Button>
            </>
          </FormGroup>
        </form>
        {userData?.role === "student" && (
          <div className="mt-6 w-1/3 flex-col gap-4">
            <h3 className="mb-4 text-2xl">Your stats</h3>
            <p>{`Total class currently enrolled in: ${
              userData?.enrolledIn.length ?? 0
            }`}</p>
            <p>{`Total submissions: ${userData?.submissions.length ?? 0}`}</p>
            <p>{`Average submission's grade: ${averageGrade}`}</p>
          </div>
        )}
      </section>
    </HeaderLayout>
  );
}

export default ProfileScreen;
