import { useForm } from "react-hook-form";
import { useToggle } from "react-use";
import Button, { Variant } from "src/components/common/Button";
import LinkButton, {
  LinkButtonVariant,
} from "src/components/common/Button/LinkButton";
import FormGroup from "src/components/common/Form/FormGroup";
import { DownloadIcon } from "src/components/common/Icons";
import Table from "src/components/common/Table";
import { supabase } from "src/libs/supabaseClient";
import { getKeyUrl } from "src/utils/helper";
import { trpc } from "src/utils/trpc";

type TSubmission = {
  id: string;
  fileName: string;
  assignmentName: string;
  assignmentId: string;
  assignmentNumber: number;
  studentId: string;
  studentName: string | null;
  grade: number | null;
};

const GradeEditable = ({
  submission,
  onUpdate,
}: {
  submission: TSubmission;
  onUpdate: () => void;
}) => {
  const [isEditing, toggleIsEditing] = useToggle(false);

  const { register, handleSubmit } = useForm<{ grade: number }>();

  const updateGradeMutation = trpc.submission.updateGrade.useMutation();

  const handleGradeSave = async ({ grade }: { grade: number }) => {
    await updateGradeMutation.mutateAsync({
      grade: grade,
      submissionId: submission.id,
    });
    toggleIsEditing();
    onUpdate();
  };

  return (
    <>
      {isEditing ? (
        <form onSubmit={handleSubmit(handleGradeSave)}>
          <FormGroup label="Grade" name="grade">
            <span className="flex gap-2">
              <input
                id="grade"
                {...register("grade", {
                  required: true,
                  valueAsNumber: true,
                  min: 0,
                  max: 10,
                })}
              />

              <Button type="submit" variant={Variant.Primary}>
                Save
              </Button>
            </span>
          </FormGroup>
        </form>
      ) : (
        <LinkButton
          variant={LinkButtonVariant.Primary}
          onClick={toggleIsEditing}
        >
          {submission.grade === null ? "N/A" : submission.grade}
        </LinkButton>
      )}
    </>
  );
};

export const SubmissionsSection = ({
  classroomId,
}: {
  classroomId: string;
}) => {
  const submissionsQuery = trpc.submission.getSubmissionForClassroom.useQuery({
    classroomId,
  });

  //TODO: extract this to a helper function
  const getDownloadUrl = async ({
    submissionId,
    filename,
    studentId,
  }: {
    submissionId: string;
    filename: string;
    studentId: string;
  }) => {
    const { data } = await supabase.storage
      .from("files")
      .getPublicUrl(getKeyUrl({ submissionId, studentId, filename }), {
        download: true,
      });

    if (data) {
      window.open(data.publicUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section>
      <h3 className="mb-6 text-center">Submissions</h3>
      {submissionsQuery.data && (
        <Table
          headers={[
            "Student",
            "Grade",
            "Assignment Name",
            "Assignment Number",
            "actions",
          ]}
          rows={submissionsQuery.data.map((submission) => [
            submission.studentName,
            <>
              <GradeEditable
                submission={submission}
                onUpdate={submissionsQuery.refetch}
              />
            </>,
            submission.assignmentName,
            submission.assignmentNumber,
            <div className="-ml-4" key={submission.id}>
              <LinkButton
                variant={LinkButtonVariant.Primary}
                onClick={() =>
                  getDownloadUrl({
                    submissionId: submission.id,
                    filename: submission.fileName,
                    studentId: submission.studentId,
                  })
                }
              >
                <DownloadIcon /> Download
              </LinkButton>
            </div>,
          ])}
        />
      )}
    </section>
  );
};
