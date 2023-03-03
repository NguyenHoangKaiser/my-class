import type { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { ClassroomOverviewScreen } from "src/components/screens/classroom-overview/ClassroomOverviewScreen";
import HeaderLayout from "src/layouts/HeaderLayout";
import type { NextPageWithLayout } from "src/pages/_app";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";

const ClassroomOverviewPage: NextPageWithLayout = () => {
  const router = useRouter();
  const classroomId = router.query.classroomId as string;

  return (
    <>
      <Head>
        <title>Classroom Overview</title>
        <meta
          name="description"
          content="all of the classrooms you've created as a teacher"
        />
      </Head>

      <ClassroomOverviewScreen classroomId={classroomId} />
    </>
  );
};

ClassroomOverviewPage.getLayout = (page) => <HeaderLayout>{page}</HeaderLayout>;

export default ClassroomOverviewPage;

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
