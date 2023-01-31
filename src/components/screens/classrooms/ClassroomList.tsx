import type { Classroom } from "@prisma/client";
import ClassroomCard from "./ClassroomCard";

function ClassroomsList({ classrooms }: { classrooms: Classroom[] }) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="grid grid-cols-3 gap-4">
        {classrooms.map((classroom) => (
          <ClassroomCard key={classroom.id} classroom={classroom} />
        ))}
      </ul>
    </div>
  );
}

export default ClassroomsList;
