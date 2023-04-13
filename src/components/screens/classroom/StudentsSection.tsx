import React from "react";
import { EmptyStateWrapper } from "src/components/common";
import { trpc } from "src/utils/trpc";
import NoStudents from "./NoStudents";
import Students from "./Students";

function StudentsSection({ classroomId }: { classroomId: string }) {
  const { data, isLoading } = trpc.classroom.getStudents.useQuery({
    classroomId,
  });

  return (
    <EmptyStateWrapper
      isLoading={isLoading}
      data={data}
      EmptyComponent={<NoStudents />}
      NonEmptyComponent={<Students students={data ?? []} />}
    />
  );
}

export default StudentsSection;
