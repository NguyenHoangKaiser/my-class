import Image from "next/image";
import assignmentsImage from "src/assets/assignments.svg";
import Button, { Variant } from "src/components/common/Button";

function NoAssignments({
  openAssignmentModal,
}: {
  openAssignmentModal: () => void;
}) {
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
      <div className="self-center">
        <Button onClick={openAssignmentModal} variant={Variant.Primary}>
          Create An Assignment
        </Button>
      </div>
    </div>
  );
}

export default NoAssignments;
