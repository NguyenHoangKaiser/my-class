import type { NextPage } from "next";
import Head from "next/head";
import BrowseClassroomsScreen from "src/components/screens/browse-classrooms/BrowseClassRoomsScreen";
import HeaderLayout from "src/layouts/HeaderLayout";

const BrowseClassroomsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Browse Classrooms</title>
        <meta name="description" content="Browse classrooms page" />
      </Head>

      <HeaderLayout>
        <BrowseClassroomsScreen />
      </HeaderLayout>
    </>
  );
};

export default BrowseClassroomsPage;
