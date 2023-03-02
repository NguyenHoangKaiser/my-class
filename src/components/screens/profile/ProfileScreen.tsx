import type { Classroom, Submission, User } from "@prisma/client";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { MainHeading } from "src/components/common";
import Alert, { useDismissible } from "src/components/common/Alert";
import Button from "src/components/common/Button";
import LinkButton from "src/components/common/Button/LinkButton";
import FormGroup from "src/components/common/Form/FormGroup";
import Table from "src/components/common/Table";
import { trpc } from "src/utils/trpc";

type FormData = {
  displayName: string;
};

function ProfileScreen() {
  const { dismiss, show, isDisplayed } = useDismissible();
  const router = useRouter();

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
  const { data: classData } = trpc.user.getGradeEachClassroom.useQuery();
  console.log("classData", classData);

  const totalGrade = classData?.reduce((acc, curr) => {
    if (curr.grade < 0) {
      return acc;
    }
    return acc + curr.grade;
  }, 0);

  const submissionHasGrade = userData?.submissions.filter(
    (submission) => submission.grade !== null
  );

  const averageGrade =
    submissionHasGrade && totalGrade
      ? totalGrade / submissionHasGrade.length
      : 0;

  const queryClient = trpc.useContext();

  const handleProfileSubmit = async (data: FormData) => {
    await updateDisplayName.mutateAsync({
      displayName: data.displayName,
    });
    queryClient.user.getUser.invalidate();
    show();
  };

  return (
    <>
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
          <>
            <div className="mt-6 w-1/3 flex-col gap-4">
              <h3 className="mb-4 text-2xl">Your stats</h3>
              <p>{`Total class currently enrolled in: ${
                userData?.enrolledIn.length ?? 0
              }`}</p>
              <p>{`Total submissions: ${userData?.submissions.length ?? 0}`}</p>
              <p>{`Average submission's grade: ${averageGrade}`}</p>
            </div>
            {classData && classData.length > 0 && (
              <div className="mt-4 flex flex-col gap-4">
                <div className="flex items-center gap-8">
                  <h3 className="text-2xl">Grade Table</h3>
                </div>
                <div className="overflow-x-auto">
                  <Table
                    headers={[
                      "Class name",
                      "Total Assignments",
                      "Total Submission Graded",
                      "Grade",
                      "Actions",
                    ]}
                    rows={classData.map((classroom, index) => [
                      classroom.name,
                      classroom.assignments.length,
                      classroom.assignments.filter(
                        (assignment) =>
                          assignment.submissions.filter(
                            (submission) => submission.grade !== null
                          ).length > 0
                      ).length,
                      classroom.grade < 0 ? "N/A" : classroom.grade,
                      <LinkButton
                        onClick={() => {
                          router.push(`/classrooms/${classroom.id}`);
                        }}
                        key={index}
                        className="self-start"
                      >
                        View
                      </LinkButton>,
                    ])}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

export default ProfileScreen;
