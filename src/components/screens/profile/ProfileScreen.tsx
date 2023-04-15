import {
  ClockCircleOutlined,
  CompassOutlined,
  MailOutlined,
  ManOutlined,
  QuestionCircleOutlined,
  ReadOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import type { TabsProps } from "antd";
import { Skeleton } from "antd";
import { Button, Col, Row, Space, Tabs, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useMemo } from "react";
import profileImage from "src/assets/profile.jpeg";
import { ClassIcon } from "src/components/common/Icons";
import { firstLetterToUpperCase } from "src/utils/helper";
import { trpc } from "src/utils/trpc";
import ClassOverviewTab from "./ClassOverviewTab";
import EditProfileModal from "./EditProfileModal";
import StudentOverviewTab from "./StudentOverviewTab";
import ReactMarkdown from "react-markdown";

type Props = {
  userId?: string | undefined;
  isProfile?: boolean;
};

function ProfileScreen({ userId, isProfile }: Props) {
  const { data } = useSession();
  const [showEditProfileModal, setShowEditProfileModal] =
    React.useState<boolean>(false);

  const {
    data: userData,
    refetch: userProfileRefetch,
    isLoading,
  } = trpc.user.getProfile.useQuery({ userId });

  // memoize the item of the tab
  const tabList = useMemo(() => {
    if (data?.user?.id === userId) {
      return [
        {
          key: "1",
          label: (
            <span>
              <ReadOutlined />
              Overview
            </span>
          ),
          children:
            userData?.role === "teacher" ? (
              <ClassOverviewTab userId={userId} />
            ) : userData?.role === "student" ? (
              <StudentOverviewTab />
            ) : (
              <Typography.Text>Please select a role first</Typography.Text>
            ),
        },
        {
          key: "2",
          label: (
            <span>
              <SettingOutlined />
              Setting
            </span>
          ),
          children: "Coming soon",
        },
      ] as TabsProps["items"];
    } else {
      return [
        {
          key: "1",
          label: (
            <span>
              <ReadOutlined />
              Overview
            </span>
          ),
          children:
            userData?.role === "teacher" ? (
              <ClassOverviewTab userId={userId} />
            ) : userData?.role === "student" ? (
              <StudentOverviewTab />
            ) : (
              <Typography.Text>Please select a role first</Typography.Text>
            ),
        },
      ] as TabsProps["items"];
    }
  }, [data?.user?.id, userData?.role, userId]);

  // const totalGrade = classData?.reduce((acc, curr) => {
  //   if (curr.grade < 0) {
  //     return acc;
  //   }
  //   return acc + curr.grade;
  // }, 0);

  // const submissionHasGrade = userData?.submissions.filter(
  //   (submission) => submission.grade !== null
  // );

  // const averageGrade =
  //   submissionHasGrade && totalGrade
  //     ? totalGrade / submissionHasGrade.length
  //     : 0;

  return (
    <Row
      style={{
        paddingTop: "2rem",
      }}
    >
      <Col
        sm={{
          span: 24,
          offset: 0,
        }}
        lg={{
          span: 22,
          offset: 1,
        }}
        xl={{
          span: 20,
          offset: 0,
        }}
        xxl={{
          span: 18,
          offset: 3,
        }}
      >
        <Row>
          <Col
            style={{
              display: "flex",
              flexDirection: "column",
            }}
            className="px-5"
            sm={24}
            md={9}
            lg={7}
            xl={6}
            xxl={6}
          >
            {isLoading ? (
              <Skeleton.Avatar active size={270} shape="circle" />
            ) : (
              <div className="relative">
                <Image
                  loading="eager"
                  alt="User Avatar"
                  width={270}
                  height={270}
                  className="mb-2 self-center rounded-full border border-gray-500"
                  src={userData?.image ?? profileImage}
                />
                <Tag
                  style={{
                    position: "absolute",
                    bottom: 30,
                    right: 16,
                    borderRadius: 50,
                  }}
                  color={
                    userData?.role
                      ? userData?.role === "teacher"
                        ? "purple-inverse"
                        : "lime-inverse"
                      : "default"
                  }
                >
                  {firstLetterToUpperCase(
                    userData?.role ?? "No role specified"
                  )}
                </Tag>
              </div>
            )}
            {isLoading ? (
              <Skeleton
                active
                style={{
                  marginTop: 16,
                }}
                paragraph={{
                  rows: 5,
                }}
              />
            ) : (
              <>
                <Typography.Title level={3}>{userData?.name}</Typography.Title>
                {userData?.displayName && (
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: 20,
                    }}
                  >
                    {userData?.displayName}
                  </Typography.Text>
                )}
                <ReactMarkdown className="my-2 text-lg text-black line-clamp-4 dark:text-white">{`${userData?.bio}`}</ReactMarkdown>
                <Button
                  block
                  type="default"
                  disabled={!isProfile && data?.user?.id !== userId}
                  size="middle"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  Edit profile
                </Button>
                {userData?.role === "teacher" && (
                  <Space
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                    }}
                    size="small"
                  >
                    <ClassIcon
                      style={{
                        fontSize: 18,
                      }}
                    />
                    <Typography.Text
                      style={{
                        fontSize: 16,
                      }}
                    >
                      {userData?._count?.classrooms ?? 0} classes &nbsp; •
                    </Typography.Text>
                    <TeamOutlined
                      style={{
                        fontSize: 16,
                      }}
                    />
                    <Typography.Text
                      style={{
                        fontSize: 16,
                      }}
                    >
                      {userData?.totalStudents ?? 0} students
                    </Typography.Text>
                  </Space>
                )}
                <Space
                  style={{
                    marginTop: 10,
                  }}
                  size="middle"
                >
                  <UserOutlined
                    style={{
                      fontSize: 16,
                    }}
                  />
                  <Typography.Text>
                    {userData?.age
                      ? `${userData?.age} years old`
                      : "No age specified"}
                  </Typography.Text>
                </Space>
                <Space
                  style={{
                    marginTop: 10,
                  }}
                  size="middle"
                >
                  {userData?.gender === "male" ? (
                    <ManOutlined style={{ fontSize: 16 }} />
                  ) : userData?.gender === "female" ? (
                    <WomanOutlined style={{ fontSize: 16 }} />
                  ) : (
                    <QuestionCircleOutlined style={{ fontSize: 16 }} />
                  )}
                  <Typography.Text>
                    {firstLetterToUpperCase(
                      userData?.gender ?? "No gender specified"
                    )}
                  </Typography.Text>
                </Space>
                <Space
                  style={{
                    marginTop: 10,
                  }}
                  size="middle"
                >
                  <ClockCircleOutlined
                    style={{
                      fontSize: 16,
                    }}
                  />
                  <Typography.Text>
                    Join at{" "}
                    {dayjs(userData?.createdAt).format("DD/MM/YYYY HH:mm")}
                  </Typography.Text>
                </Space>
                <Space
                  style={{
                    marginTop: 10,
                  }}
                  size="middle"
                >
                  <CompassOutlined
                    style={{
                      fontSize: 16,
                    }}
                  />
                  <Typography.Text>
                    {userData?.location ?? "No location specified"}
                  </Typography.Text>
                </Space>
                <Space
                  style={{
                    marginTop: 10,
                  }}
                  size="middle"
                >
                  <MailOutlined
                    style={{
                      fontSize: 16,
                    }}
                  />
                  <Typography.Text>{userData?.email}</Typography.Text>
                </Space>
              </>
            )}
          </Col>
          <Col className="px-5 " sm={24} md={15} lg={17} xl={18} xxl={18}>
            <Tabs
              size="large"
              defaultActiveKey="1"
              items={tabList}
              // onChange={onChange}
            />
          </Col>
        </Row>
        <EditProfileModal
          open={showEditProfileModal}
          refetch={userProfileRefetch}
          onCancel={() => setShowEditProfileModal(false)}
          profile={{
            displayName: userData?.displayName,
            bio: userData?.bio,
            age: userData?.age,
            gender: userData?.gender,
            location: userData?.location,
          }}
        />
      </Col>
    </Row>
  );
}

export default ProfileScreen;

{
  /* <MainHeading title="Your Profile" />;

{
  isDisplayed && (
    <Alert
      message="Your profile has been successfully updated."
      onClose={dismiss}
    />
  );
}

<section className="px-5">
  <h2 className="mb-4 text-2xl">Settings</h2>
  <form onSubmit={handleSubmit(handleProfileSubmit)} className="w-1/3">
    <FormGroup
      label="Display Name"
      error={errors.displayName && "Display name is required"}
      name="displayName"
    >
      <>
        <input
          id="displayName"
          className="mb-2"
          {...register("displayName", { required: true })}
        />
        <Button isLoading={updateDisplayName.isLoading} className="self-start">
          Update
        </Button>
      </>
    </FormGroup>
  </form>
  {userData?.role === "student" && (
    <>
      <div className="mt-6 w-1/3 flex-col gap-4">
        <h3 className="mb-4 text-2xl">Your stats</h3>
        <p>{`Total class currently enrolled in: ${
          userData?.enrolledIn.length ?? 0
        }`}</p>
        <p>{`Total submissions: ${userData?.submissions.length ?? 0}`}</p>
        <p>{`Average submission's grade: ${averageGrade}`}</p>
      </div>
      {classData && classData.length > 0 && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center gap-8">
            <h3 className="text-2xl">Grade Table</h3>
          </div>
          <div className="overflow-x-auto">
            <Table
              headers={[
                "Class name",
                "Total Assignments",
                "Total Submission Graded",
                "Grade",
                "Actions",
              ]}
              rows={classData.map((classroom, index) => [
                classroom.name,
                classroom.assignments.length,
                classroom.assignments.filter(
                  (assignment) =>
                    assignment.submissions.filter(
                      (submission) => submission.grade !== null
                    ).length > 0
                ).length,
                classroom.grade < 0 ? "N/A" : classroom.grade,
                <LinkButton
                  onClick={() => {
                    router.push(`/classrooms/${classroom.id}`);
                  }}
                  key={index}
                  className="self-start"
                >
                  View
                </LinkButton>,
              ])}
            />
          </div>
        </div>
      )}
    </>
  )}
</section>; */
}
