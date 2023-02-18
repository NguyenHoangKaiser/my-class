import type { Classroom } from "@prisma/client";
import Link from "next/link";
import { Card } from "src/components/common";

function ClassroomCard({ classroom }: { classroom: Classroom }) {
  return (
    <Card
      titleAs="h2"
      title={classroom.name}
      body={classroom.description ?? "Default description"}
    >
      <div className="flex justify-end">
        <Link href={`/classrooms/${classroom.id}`} className="text-blue-500">
          Manage Classroom
        </Link>
      </div>
    </Card>
  );
}

export default ClassroomCard;
