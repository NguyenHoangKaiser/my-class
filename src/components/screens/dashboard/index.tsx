import { MainHeading } from "src/components/common";
import EmptyStateDashboard from "./EmptyStateDashboard";
import { trpc } from "src/utils/trpc";
import ClassroomsList from "../classrooms/ClassroomList";

function DashboardScreen() {
  const enrolledClassroomsQuery = trpc.student.getClassrooms.useQuery({});

  const { data: classrooms, isLoading } = enrolledClassroomsQuery;

  return (
    <div>
      <MainHeading title="Your Classrooms" />

      <ClassroomsList
        emptyComponent={<EmptyStateDashboard />}
        isLoading={isLoading}
        classrooms={classrooms ?? []}
      />
    </div>
  );
}

export default DashboardScreen;
