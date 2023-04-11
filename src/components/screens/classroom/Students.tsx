import Link from "next/link";
import type { ReactNode } from "react";
import profileImage from "src/assets/profile.jpeg";
import Image from "next/image";
import Table from "src/components/common/Table";
import { EyeIcon } from "src/components/common/Icons";
import { TabWrapper } from "src/components/common";

type TStudent = {
  image: string | null;
  id: string;
  name: string | null;
};

function Students({ students }: { students: TStudent[] }) {
  const totalStudents = students.length;

  return (
    <TabWrapper>
      <div className="flex items-center gap-8">
        <h3 className="text-2xl">{totalStudents} Student(s) Enrolled</h3>
      </div>
      <Table
        headers={["Name", "Grade", "Actions"]}
        rows={students.map((student, index) => [
          <div
            key={`${student.id}_${index}`}
            className="flex items-center gap-2"
          >
            <Image
              width="30"
              height="30"
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-full"
              src={student.image ?? profileImage}
              alt=""
            />{" "}
            {student.name}
          </div>,
          "65% (D) (Not Graded Yet)",
          (
            <div className="flex gap-4">
              <Link
                href={`/students/${student.id}`}
                className="link flex items-center gap-1"
              >
                <EyeIcon /> View
              </Link>
            </div>
          ) as ReactNode,
        ])}
      />
    </TabWrapper>
  );
}

export default Students;
