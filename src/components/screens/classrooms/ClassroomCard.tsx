import type { Classroom } from "@prisma/client";
import Link from "next/link";
import { Card } from "src/components/common";
import Button, { Variant } from "src/components/common/Button";

function ClassroomCard({ classroom }: { classroom: Classroom }) {
  return (
    <Card
      titleAs="h2"
      title={classroom.name}
      body={classroom.description ?? "Default description"}
    >
      <div className="flex justify-end">
        <Button variant={Variant.Primary}>
          <Link href={`/classrooms/${classroom.id}`}>Manage Classroom</Link>
        </Button>
      </div>
    </Card>
  );
}

export default ClassroomCard;
