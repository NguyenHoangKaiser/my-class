import Image from "next/image";
import Link from "next/link";
import teacherImage from "src/assets/teacher.svg";
import Button, { Variant } from "src/components/common/Button";

function EmptyStateDashboard() {
  return (
    <div className="mx-auto flex w-1/3 flex-col items-center justify-center gap-8">
      <Image
        width="300"
        height="300"
        src={teacherImage}
        alt="no classrooms found"
      />
      <div className="text-2xl">You have no classrooms yet!</div>
      <Link href="/browse-classrooms" passHref>
        <Button variant={Variant.Primary}>
          Browse for Classrooms
        </Button>
      </Link>
    </div>
  );
}

export default EmptyStateDashboard;
