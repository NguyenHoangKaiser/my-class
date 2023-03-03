import type { GetServerSideProps } from "next";
import Head from "next/head";
import BrowseClassroomsScreen from "src/components/screens/browse-classrooms/BrowseClassRoomsScreen";
import HeaderLayout from "src/layouts/HeaderLayout";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import type { NextPageWithLayout } from "./_app";

const BrowseClassroomsPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Browse Classrooms</title>
        <meta name="description" content="Browse classrooms page" />
      </Head>

      <BrowseClassroomsScreen />
    </>
  );
};

BrowseClassroomsPage.getLayout = (page) => <HeaderLayout>{page}</HeaderLayout>;

export default BrowseClassroomsPage;

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
  } else if (session.user.role === "teacher") {
    return {
      redirect: {
        destination: "/classrooms",
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
};
