import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import feynman from "src/assets/richard-feynman.jpeg";
import student from "src/assets/student.jpeg";
import { trpc } from "src/utils/trpc";
import { useRouter } from "next/router";
import reloadSession from "src/utils/reloadSession";
import { getServerAuthSession } from "src/server/common/get-server-auth-session";
import { Button, Col, Row, Typography, theme } from "antd";
import { useState } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
const { useToken } = theme;
const Welcome: NextPage = () => {
  const router = useRouter();
  const { token } = useToken();
  const [role, setRole] = useState<string>();
  const { mutateAsync: setRoleAsTeacher } =
    trpc.auth.setRoleAsTeacher.useMutation();

  const { mutateAsync: setRoleAsStudent } =
    trpc.auth.setRoleAsStudent.useMutation();

  const setTeacherRole = async () => {
    await setRoleAsTeacher();
    reloadSession();
    router.push("/classrooms");
  };

  const setStudentRole = async () => {
    await setRoleAsStudent();
    reloadSession();
    router.push("/dashboard");
  };

  return (
    <>
      <Head>
        <title>Sign up</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta
          name="description"
          content="sign up now for a teacher or a student account in order to access the website"
        />
      </Head>

      <Row>
        <Col
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            padding: "2rem",
            marginTop: "7rem",
          }}
          span={24}
        >
          <Typography.Title level={1}>
            Welcome to My-Classroom!
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: "1.125rem" }}>
            Before we start, click what type of role you want to be:
          </Typography.Paragraph>
          <Row
            style={{
              backgroundColor: token.colorBgLayout,
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            gutter={[32, 16]}
          >
            <Col span={24}>
              <Row gutter={[32, 16]}>
                <Col span={12}>
                  <button
                    className="flex w-[300px] flex-col rounded-lg border border-gray-500 bg-slate-200 hover:shadow-lg hover:outline-none hover:ring-2 hover:ring-white hover:ring-offset-2 hover:ring-offset-gray-800 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:border-gray-600 dark:bg-gray-900 dark:hover:shadow-black/30"
                    onClick={() => setRole("teacher")}
                  >
                    <Image
                      style={{
                        height: 190,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                      src={feynman}
                      alt="A picture of Richard Feynman(well known physics professor) teaching"
                    />
                    <Typography.Title level={4} className="mt-3">
                      I&apos;m a teacher
                    </Typography.Title>
                  </button>
                </Col>
                <Col span={12}>
                  <button
                    className="flex w-[300px] flex-col rounded-lg border border-gray-500 bg-slate-200  hover:shadow-lg hover:outline-none hover:ring-2 hover:ring-white hover:ring-offset-2 hover:ring-offset-gray-800 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 dark:border-gray-600 dark:bg-gray-900 dark:hover:shadow-black/30"
                    onClick={() => setRole("student")}
                  >
                    <Image
                      style={{
                        height: 190,
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                      src={student}
                      alt="A person studying"
                    />
                    <Typography.Title level={4} className="mt-3">
                      I&apos;m a student
                    </Typography.Title>
                  </button>
                </Col>
              </Row>
              <Col className="mt-5" span={24}>
                {role === "teacher" && (
                  <Typography.Paragraph style={{ fontSize: "16p" }}>
                    Teacher accounts allow you to create classrooms and manage
                    the students in them.
                  </Typography.Paragraph>
                )}
                {role === "student" && (
                  <Typography.Paragraph style={{ fontSize: "16p" }}>
                    Student accounts allow you to join classrooms and access the
                    content in them.
                  </Typography.Paragraph>
                )}
                {!role && (
                  <Typography.Paragraph style={{ fontSize: "16p" }}>
                    Please select a role to continue.
                  </Typography.Paragraph>
                )}
              </Col>
            </Col>
          </Row>
          <Button
            size="large"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "2rem",
              width: 270,
            }}
            type="primary"
            disabled={!role}
            onClick={
              role === "teacher"
                ? setTeacherRole
                : role === "student"
                ? setStudentRole
                : undefined
            }
          >
            {`CONTINUE AS ${(role || "")?.toLocaleUpperCase()}`}{" "}
            <ArrowRightOutlined />
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default Welcome;

/**
 * We check if the user is logged in and if not we redirect them to the home page
 * If the user is logged in and has a role we redirect them to the dashboard
 * @param context
 * @returns
 */
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession(context);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else if (session?.user?.role) {
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
