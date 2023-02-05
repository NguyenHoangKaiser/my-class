import React from "react";
import { EmptyStateWrapper } from "src/components/common";
import { trpc } from "src/utils/trpc";
import { NoStudents } from "./NoStudents";
import Students from "./Students";

function StudentsSection({ classroomId }: { classroomId: string }) {
  const studentsQuery = trpc.classroom.getStudents.useQuery({ classroomId });

  const { data: students, isLoading } = studentsQuery;

  return (
    <EmptyStateWrapper
      isLoading={isLoading}
      data={students}
      EmptyComponent={<NoStudents />}
      NonEmptyComponent={<Students students={students ?? []} />}
    />
  );
}

export default StudentsSection;
