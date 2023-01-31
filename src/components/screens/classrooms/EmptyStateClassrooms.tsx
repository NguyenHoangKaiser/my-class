import Image from "next/image";
import React from "react";
import teacherImage from "../../../assets/teacher.svg";
import Button, { Variant } from "src/components/common/Button";

function EmptyStateClassrooms({
  openClassroomModal,
}: {
  openClassroomModal: () => void;
}) {
  return (
    <div className="flex flex-col justify-center gap-8">
      <Image
        width="300"
        height="300"
        src={teacherImage}
        alt="no classrooms found"
      />
      <div className="text-2xl">You have no classrooms yet!</div>
      <Button variant={Variant.Primary} onClick={openClassroomModal}>
        Create a Classroom
      </Button>
    </div>
  );
}

export default EmptyStateClassrooms;
