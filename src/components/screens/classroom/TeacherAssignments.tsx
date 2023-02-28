import type { Assignment, Attachment } from "@prisma/client";
import Link from "next/link";
import type { ReactNode } from "react";
import { DateTime } from "luxon";
import { PencilSquare } from "src/components/common/Icons";
import Table from "src/components/common/Table";
import Button, { Variant } from "src/components/common/Button";

function TeacherAssignments({
  assignments,
  classroomId,
  openAssignmentModal,
}: {
  assignments: (Assignment & {
    attachments: Attachment[];
  })[];
  classroomId: string;
  openAssignmentModal: () => void;
}) {
  const totalAssignments = assignments.length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl">
          Your Assignments ({totalAssignments} total)
        </h2>
        <Button variant={Variant.Primary} onClick={openAssignmentModal}>
          Create an Assignment
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table
          headers={["Number", "Name", "Due Date", "Attachments", "Action"]}
          rows={assignments.map((assignment, idx) => [
            assignment.number,
            assignment.name,
            <span key={idx} className="whitespace-nowrap">
              {DateTime.fromISO(assignment.dueDate).toLocaleString(
                DateTime.DATE_MED
              )}
            </span>,
            assignment.attachments.length,
            (
              <span className="flex gap-4">
                <Link
                  href={`/classrooms/${classroomId}/assignments/${assignment.id}/edit`}
                  className="link flex items-center gap-1"
                >
                  <PencilSquare /> Edit
                </Link>
              </span>
            ) as ReactNode,
          ])}
        />
      </div>
    </div>
  );
}

export default TeacherAssignments;
