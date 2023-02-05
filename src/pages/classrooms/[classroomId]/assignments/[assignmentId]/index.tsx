import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import HeaderLayout from "src/layouts/HeaderLayout";

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
        {/* <AssignmentScreen
          classroomId={classroomId}
          assignmentId={assignmentId}
        /> */}
      </HeaderLayout>
    </>
  );
};

export default ClassroomAssignmentPage;
