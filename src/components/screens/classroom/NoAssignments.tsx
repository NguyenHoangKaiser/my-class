import { Button } from "antd";
import Image from "next/image";
import assignmentsImage from "src/assets/assignments.svg";
import { useSession } from "next-auth/react";

function NoAssignments({
  openAssignmentModal,
}: {
  openAssignmentModal: () => void;
}) {
  const session = useSession();
  return (
    <div className="flex flex-col gap-8">
      <div className="self-center">
        <Image
          width="300"
          height="300"
          src={assignmentsImage}
          alt="no classrooms found"
        />
      </div>
      <div className="mt-6 text-center text-2xl">
        You have no assignments yet!
      </div>
      {session.data?.user?.role === "teacher" && (
        <div className="self-center">
          <Button size="large" type="primary" onClick={openAssignmentModal}>
            Create An Assignment
          </Button>
        </div>
      )}
    </div>
  );
}

export default NoAssignments;
