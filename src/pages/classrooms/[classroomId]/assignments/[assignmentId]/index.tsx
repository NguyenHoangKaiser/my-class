import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { AssignmentScreen } from "src/components/screens/assignments/AssignmentScreen";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";

const ClassroomAssignmentPage: NextPage = () => {
  const router = useRouter();
  const assignmentId = router.query.assignmentId as string;

  return (
    <>
      <Head>
        <title>Assignment {assignmentId}</title>
        <meta
          name="description"
          content="all of the classrooms you've created as a teacher"
        />
      </Head>

      <AssignmentScreen
        // classroomId={classroomId}
        assignmentId={assignmentId}
      />
    </>
  );
};

export default ClassroomAssignmentPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else if (!session.user?.role) {
    return {
      redirect: {
        destination: "/welcome",
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
};
