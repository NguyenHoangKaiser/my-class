import type { Assignment } from "@prisma/client";
import Link from "next/link";
import type { ReactNode } from "react";
import { DateTime } from "luxon";
import { trpc } from "src/utils/trpc";
import { useSession } from "src/hooks";
import Table from "src/components/common/Table";
import { EyeIcon } from "src/components/common/Icons";

function StudentAssignments({
  assignments,
  classroomId,
}: {
  assignments: Assignment[];
  classroomId: string;
}) {
  const totalAssignments = assignments.length;

  const session = useSession();

  const submissionsQuery = trpc.submission.getSubmissionForStudent.useQuery(
    {
      studentId: session.data?.user?.id as string,
    },
    {
      enabled: !!session.data,
    }
  );

  const getSubmission = (assignmentId: string) => {
    const grade = submissionsQuery.data?.filter(
      (submission) =>
        submission.assignmentId === assignmentId && submission.grade !== null
    );
    if (!grade) return null;
    // @ts-expect-error - Even though grade maybe null, the reduce function still works
    const average = grade?.reduce((a, b) => a + b?.grade, 0) / grade?.length;
    return average;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl">
          Your Assignments ({totalAssignments} total)
        </h2>
      </div>
      <div className="overflow-x-auto">
        <Table
          headers={["Number", "Grade", "Name", "Due Date", "Actions"]}
          rows={assignments.map((assignment, idx) => [
            assignment.number,
            getSubmission(assignment.id) ?? "N/A",
            assignment.name,
            <span key={idx} className="whitespace-nowrap">
              {DateTime.fromISO(assignment.dueDate).toLocaleString(
                DateTime.DATE_MED
              )}
            </span>,
            (
              <span className="flex gap-4">
                <Link
                  href={`/classrooms/${classroomId}/assignments/${assignment.id}`}
                  className="link flex items-center gap-1"
                >
                  <EyeIcon /> View
                </Link>
              </span>
            ) as ReactNode,
          ])}
        />
      </div>
    </div>
  );
}

export default StudentAssignments;
