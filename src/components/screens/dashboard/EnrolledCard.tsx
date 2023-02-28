import type { Classroom } from "@prisma/client";
import Link from "next/link";
import { Card } from "src/components/common";
import { DateTime } from "luxon";
import Button, { Variant } from "src/components/common/Button";
import { trpc } from "src/utils/trpc";

type TProp = {
  classroom: Classroom;
};

function EnrolledCard({ classroom }: TProp) {
  const assignmentsQuery = trpc.classroom.getAssignments.useQuery({
    classroomId: classroom.id,
  });
  const assignments = assignmentsQuery.data;

  const soonestDueDate = assignments?.sort((a, b) =>
    a.dueDate < b.dueDate ? -1 : 1
  )[0]?.dueDate;

  return (
    <Card
      title={classroom.name}
      body={
        <>
          {assignments && assignments?.length > 0 ? (
            <span>
              You has <a className="text-blue-400">1 assignment</a> due soon on{" "}
              {DateTime.fromISO(soonestDueDate ?? "").toLocaleString(
                DateTime.DATE_MED
              )}
            </span>
          ) : (
            <span>You have no assignments due soon.</span>
          )}
        </>
      }
    >
      <div className="flex justify-end">
        <Link href={`/classrooms/${classroom.id}`}>
          <Button variant={Variant.Primary} color="primary">
            View
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default EnrolledCard;
