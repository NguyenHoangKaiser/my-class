import { Button } from "antd";
import Image from "next/image";
import React from "react";
import teacherImage from "../../../assets/teacher.svg";

function EmptyStateClassrooms({
  openClassroomModal,
}: {
  openClassroomModal: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 px-5">
      <Image
        width="300"
        height="300"
        src={teacherImage}
        alt="no classrooms found"
      />
      <div className="text-2xl">You have no classrooms yet!</div>
      <Button type="primary" size="large" onClick={openClassroomModal}>
        Create a Class
      </Button>
    </div>
  );
}

export default EmptyStateClassrooms;
