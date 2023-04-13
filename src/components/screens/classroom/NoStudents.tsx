import React from "react";
import assignmentsImage from "src/assets/assignments.svg";
import Image from "next/image";

function NoStudents() {
  return (
    <div className="flex flex-col gap-8">
      <div className="self-center">
        <Image
          width="300"
          height="300"
          src={assignmentsImage}
          alt="no students enrolled"
        />
      </div>
      <div className="mt-6 text-center text-2xl">
        You have no students enrolled yet!
      </div>
    </div>
  );
}

export default NoStudents;
