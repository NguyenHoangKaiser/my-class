import type { User } from "@prisma/client";
import {
  Button,
  Col,
  Row,
  Space,
  Tabs,
  TabsProps,
  Tag,
  Typography,
} from "antd";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { MainHeading } from "src/components/common";
// import Alert, { useDismissible } from "src/components/common/Alert";
import { trpc } from "src/utils/trpc";
import profileImage from "src/assets/profile.jpeg";
import {
  AuditOutlined,
  ClockCircleOutlined,
  CompassOutlined,
  IdcardOutlined,
  MailOutlined,
  ManOutlined,
  QuestionCircleOutlined,
  QuestionOutlined,
  ReadOutlined,
  TeamOutlined,
  UserOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { firstLetterToUpperCase } from "src/utils/helper";
import OverviewTab from "./OverviewTab";

type FormData = {
  displayName: string;
};

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: (
      <span>
        <AuditOutlined /> Overview
      </span>
    ),
    children: <OverviewTab />,
  },
  {
    key: "2",
    label: `Tab 2`,
    children: `Content of Tab Pane 2`,
  },
  {
    key: "3",
    label: `Tab 3`,
    children: `Content of Tab Pane 3`,
  },
];

function ProfileScreen() {
  // const { dismiss, show, isDisplayed } = useDismissible();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>();

  const updateDisplayName = trpc.user.updateDisplayName.useMutation();

  const { data: userData } = trpc.user.getProfile.useQuery(undefined, {
    onSuccess(
      userData: User & {
        classroomsNo?: number;
        enrolledNo?: number;
        submissionsNo?: number;
        ratingsNo?: number;
        commentsNo?: number;
      }
    ) {
      console.log("userData", userData);
    },
  });
  const { data: classData } = trpc.user.getGradeEachClassroom.useQuery();
  console.log("classData", classData);

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

  const queryClient = trpc.useContext();

  const handleProfileSubmit = async (data: FormData) => {
    await updateDisplayName.mutateAsync({
      displayName: data.displayName,
    });
    queryClient.user.getUser.invalidate();
    // show();
  };

  return (
    <Row
      style={{
        paddingTop: "2rem",
      }}
    >
      <Col span={22} offset={1}>
        <Row>
          <Col
            style={{
              display: "flex",
              flexDirection: "column",
            }}
            className="px-5"
            span={5}
          >
            <Image
              alt="User Avatar"
              width={270}
              height={270}
              className="mb-2 self-center rounded-full border border-gray-500"
              src={userData?.image ?? profileImage}
            />
            <Typography.Title level={3}>{userData?.name}</Typography.Title>
            <Typography.Text
              type="secondary"
              style={{
                fontSize: 20,
              }}
            >
              {userData?.displayName}
            </Typography.Text>
            <Typography.Paragraph
              ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
              style={{ fontSize: 16, marginTop: 10 }}
            >
              {userData?.bio ?? "No bio"}
            </Typography.Paragraph>
            <Button block type="default" size="middle">
              Edit profile
            </Button>
            <Space
              style={{
                marginTop: 10,
              }}
              size="middle"
            >
              <IdcardOutlined
                style={{
                  fontSize: 16,
                }}
              />
              <Tag
                color={
                  userData?.role
                    ? userData?.role === "teacher"
                      ? "purple"
                      : "lime"
                    : "default"
                }
              >
                {firstLetterToUpperCase(userData?.role ?? "No role specified")}
              </Tag>
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
              <Typography.Text
                style={{
                  fontSize: 14,
                }}
              >
                Join at {dayjs(userData?.createdAt).format("DD/MM/YYYY HH:mm")}
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
              <Typography.Text
                style={{
                  fontSize: 14,
                }}
              >
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
              <Typography.Text
                style={{
                  fontSize: 14,
                }}
              >
                {userData?.email}
              </Typography.Text>
            </Space>
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
              <Typography.Text
                style={{
                  fontSize: 14,
                }}
              >
                {userData?.age ?? "No age specified"}
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
              <Typography.Text
                style={{
                  fontSize: 14,
                }}
              >
                {firstLetterToUpperCase(
                  userData?.gender ?? "No gender specified"
                )}
              </Typography.Text>
            </Space>
          </Col>
          <Col span={18}>
            <Tabs
              size="large"
              defaultActiveKey="1"
              items={items}
              onChange={onChange}
            />
          </Col>
        </Row>
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
