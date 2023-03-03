import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import ClassroomScreen from "src/components/screens/classroom/ClassroomScreen";
import HeaderLayout from "src/layouts/HeaderLayout";
import type { NextPageWithLayout } from "src/pages/_app";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";

const ClassroomPage: NextPageWithLayout = () => {
  const router = useRouter();
  const classroomId = router.query.classroomId as string;

  return (
    <>
      <Head>
        <title>Classrooms</title>
        <meta
          name="description"
          content="all of the classrooms you've created as a teacher"
        />
      </Head>

      <ClassroomScreen classroomId={classroomId} />
    </>
  );
};

ClassroomPage.getLayout = (page) => <HeaderLayout>{page}</HeaderLayout>;

export default ClassroomPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);
  // const classroomId = context.params?.classroomId as string;

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
    //!! Make sure the user is a teacher or student in the classroom
    //!! But calling prisma in getServerSideProps is not recommended
    // } else if (session.user?.role === "teacher") {
    //   const isClassTeacher = await prisma?.classroom.findFirst({
    //     where: {
    //       id: classroomId,
    //       userId: session?.user?.id,
    //     },
    //   });

    //   if (!isClassTeacher) {
    //     return {
    //       redirect: {
    //         destination: "/classrooms",
    //         permanent: false,
    //       },
    //     };
    //   }
    //   return { props: {} };
    // } else if (session.user?.role === "student") {
    //   const isClassStudent = await prisma?.classroom.findFirst({
    //     where: {
    //       id: classroomId,
    //       students: {
    //         some: {
    //           id: session?.user?.id,
    //         },
    //       },
    //     },
    //   });

    //   if (!isClassStudent) {
    //     return {
    //       redirect: {
    //         destination: "/classrooms",
    //         permanent: false,
    //       },
    //     };
    //   }
    //   return { props: {} };
  } else {
    return { props: {} };
  }
};
