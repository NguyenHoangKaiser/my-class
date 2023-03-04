import type { GetServerSideProps } from "next";
import Head from "next/head";
import CreateClassroomScreen from "src/components/screens/classrooms/CreateClassroomScreen";
import HeaderLayout from "src/layouts/HeaderLayout";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import type { NextPageWithLayout } from "../_app";

const CreateClassrooms: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Classrooms</title>
        <meta
          name="description"
          content="Create a new classroom for your students"
        />
      </Head>

      <CreateClassroomScreen />
    </>
  );
};

CreateClassrooms.getLayout = (page) => <HeaderLayout>{page}</HeaderLayout>;

export default CreateClassrooms;

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
  } else if (session.user?.role !== "teacher") {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  } else {
    return { props: {} };
  }
};
