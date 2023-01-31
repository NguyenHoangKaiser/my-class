import type { Classroom } from "@prisma/client";
import Link from "next/link";
import { Card } from "src/components/common";

function ClassroomCard({ classroom }: { classroom: Classroom }) {
  return (
    <Card
      titleAs="h2"
      title={classroom.name}
      body="ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia,
      nulla! Maiores et perferendis eaque, exercitationem praesentium nihil."
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
