import React from "react";
import assignmentsImage from "src/assets/assignments.svg";
import Image from "next/image";
import Button, { Variant } from "src/components/common/Button";

export const NoStudents = () => {
  return (
    <div className="flex flex-col gap-8">
      <Image
        width="300"
        height="300"
        src={assignmentsImage}
        alt="no students enrolled"
      />
      <div className="text-center text-2xl">
        You have no students enrolled yet!
      </div>
      <div className="self-center">
        <Button variant={Variant.Primary}>Send Email Invite</Button>
      </div>
    </div>
  );
};
