import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import { EditAssignmentScreen } from "src/components/screens/edit-assignments/EditAssignmentScreen";
import HeaderLayout from "src/layouts/HeaderLayout";
import type { NextPageWithLayout } from "src/pages/_app";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";

const ClassroomPage: NextPageWithLayout = () => {
  const router = useRouter();
  const classroomId = router.query.classroomId as string;
  const assignmentId = router.query.assignmentId as string;

  return (
    <>
      <Head>
        <title>Classrooms</title>
        <meta
          name="description"
          content="all of the classrooms you've created as a teacher"
        />
      </Head>

      <EditAssignmentScreen
        classroomId={classroomId}
        assignmentId={assignmentId}
      />
    </>
  );
};

ClassroomPage.getLayout = (page) => <HeaderLayout>{page}</HeaderLayout>;

export default ClassroomPage;

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
