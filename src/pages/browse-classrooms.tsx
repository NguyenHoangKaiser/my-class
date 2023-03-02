import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import BrowseClassroomsScreen from "src/components/screens/browse-classrooms/BrowseClassRoomsScreen";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";

const BrowseClassroomsPage: NextPage = () => {
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
