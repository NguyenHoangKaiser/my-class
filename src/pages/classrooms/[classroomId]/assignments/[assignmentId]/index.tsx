import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { AssignmentScreen } from "src/components/screens/assignments/AssignmentScreen";
import HeaderLayout from "src/layouts/HeaderLayout";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";

const ClassroomAssignmentPage: NextPage = () => {
  const router = useRouter();
  const classroomId = router.query.classroomId as string;
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

      <HeaderLayout>
        <AssignmentScreen
          // classroomId={classroomId}
          assignmentId={assignmentId}
        />
      </HeaderLayout>
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
