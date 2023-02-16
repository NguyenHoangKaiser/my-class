import Image from "next/image";
import React from "react";
import teacherImage from "src/assets/teacher.svg";

function EmptyStateAttachments() {
  return (
    <div className="mx-auto flex w-1/3 flex-col items-center justify-center gap-8">
      <Image
        width="150"
        height="150"
        src={teacherImage}
        alt="no classrooms found"
      />
      <div className="text-2xl">You have no attachments yet!</div>
    </div>
  );
}
export default EmptyStateAttachments;
