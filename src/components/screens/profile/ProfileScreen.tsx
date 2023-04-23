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
    if (data?.user?.id === userId || !userId) {
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
              <Skeleton.Input block active />
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
              <Skeleton.Input block active />
            ),
        },
      ] as TabsProps["items"];
    }
  }, [data?.user?.id, userData?.role, userId]);

  return (
    <Row
      style={{
        paddingTop: "2rem",
        paddingBottom: "2rem",
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
                  className="mb-2 self-center rounded-full ring-1 ring-gray-500 ring-offset-2 ring-offset-gray-500 dark:ring-white dark:ring-offset-white"
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
                      fontSize: "1.25rem",
                    }}
                  >
                    {userData?.displayName}
                  </Typography.Text>
                )}
                <ReactMarkdown className="prose my-2 line-clamp-4 dark:prose-invert">{`${userData?.bio}`}</ReactMarkdown>
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
                        fontSize: "1.125rem",
                        color: "#1890ff",
                      }}
                    />
                    <Typography.Text
                      style={{
                        fontSize: "1rem",
                        color: "blue",
                      }}
                    >
                      {userData?._count?.classrooms ?? 0} classes
                    </Typography.Text>
                    <Typography.Text>•</Typography.Text>
                    <TeamOutlined
                      style={{
                        fontSize: "1rem",
                        color: "#52c41a",
                      }}
                    />
                    <Typography.Text
                      style={{
                        fontSize: "1rem",
                        color: "lime",
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
                      fontSize: "1rem",
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
                    <ManOutlined style={{ fontSize: "1rem" }} />
                  ) : userData?.gender === "female" ? (
                    <WomanOutlined style={{ fontSize: "1rem" }} />
                  ) : (
                    <QuestionCircleOutlined style={{ fontSize: "1rem" }} />
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
                      fontSize: "1rem",
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
                      fontSize: "1rem",
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
                      fontSize: "1rem",
                    }}
                  />
                  <Typography.Text>{userData?.email}</Typography.Text>
                </Space>
              </>
            )}
          </Col>
          <Col className="px-5 " sm={24} md={15} lg={17} xl={18} xxl={18}>
            <Tabs size="large" defaultActiveKey="1" items={tabList} />
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
