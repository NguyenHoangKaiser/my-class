import type { Classroom } from "@prisma/client";
import Link from "next/link";
import { Card } from "src/components/common";
import Button, { Variant } from "src/components/common/Button";

type TProp = {
  classroom: Classroom;
};

function EnrolledCard({ classroom }: TProp) {
  return (
    <Card
      title={classroom.name}
      body={
        <span>
          You has <a className="text-blue-400">1 assignment</a> due soon on
          9/28/2022
        </span>
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
