import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import HeaderLayout from "src/layouts/HeaderLayout";

const ClassroomPage: NextPage = () => {
  const router = useRouter();
  const classroomId = router.query.classroomId;

  return (
    <>
      <Head>
        <title>Classrooms</title>
        <meta
          name="description"
          content="all of the classrooms you've created as a teacher"
        />
      </Head>

      <HeaderLayout>
        {/* <ClassroomScreen classroomId={classroomId} /> */}
      </HeaderLayout>
    </>
  );
};

export default ClassroomPage;
