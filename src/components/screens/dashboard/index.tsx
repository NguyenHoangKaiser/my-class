import { EmptyStateWrapper, MainHeading } from "src/components/common";
import EmptyStateDashboard from "./EmptyStateDashboard";
import EnrolledList from "./EnrolledList";
import { trpc } from "src/utils/trpc";

function DashboardScreen() {
  const enrolledClassroomsQuery = trpc.student.getClassrooms.useQuery();

  const { data: classrooms, isLoading } = enrolledClassroomsQuery;

  return (
    <div>
      <MainHeading title="Your Classrooms" />

      <EmptyStateWrapper
        isLoading={isLoading}
        data={classrooms}
        EmptyComponent={<EmptyStateDashboard />}
        NonEmptyComponent={<EnrolledList classrooms={classrooms ?? []} />}
      />
    </div>
  );
}

export default DashboardScreen;
