import { useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import { trpc } from "../../../utils/trpc";
import {
  Avatar,
  Badge,
  Button,
  Descriptions,
  Rate,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { MainHeading } from "src/components/common";
import { firstLetterToUpperCase, getTagColor } from "src/utils/helper";
import EnrollClassroomModal from "./EnrollClassroomModal";
import Link from "next/link";

export const ClassroomOverviewScreen = ({
  classroomId,
}: {
  classroomId: string;
}) => {
  const [isEnrollModalOpen, setIsEnrollModalOpen] =
    React.useState<boolean>(false);

  const classroomQuery = trpc.classroom.getClassroom.useQuery({ classroomId });
  const userQuery = trpc.user.getUser.useQuery();
  const router = useRouter();

  const classroom = classroomQuery.data;

  const rating = classroom?.ratings
    ? classroom.ratings.reduce((a, b) => a + b.amount, 0) /
      classroom.ratings.length
    : 0;

  return (
    <>
      <MainHeading title="Classroom Overview" />
      <section className="container pl-14 pt-5">
        <Skeleton active loading={classroomQuery.isLoading}>
          <Descriptions
            labelStyle={{
              fontSize: "1.2rem",
            }}
            layout="vertical"
          >
            <Descriptions.Item label="Classroom Name">
              {classroom?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Teacher">
              <Space>
                <Avatar src={classroom?.teacher.image} />
                <Link href={`/user/${classroom?.teacher.id}`}>
                  {classroom?.teacher.displayName || classroom?.teacher.name}
                </Link>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(classroom?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="Language">
              <Tag color="yellow">
                {classroom?.language === "en" ? "English" : "Vietnamese"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag
                color={
                  classroom?.modifier === "public"
                    ? "green-inverse"
                    : "orange-inverse"
                }
              >
                {firstLetterToUpperCase(classroom?.modifier || "")}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Subject">
              <Space wrap>
                {classroom && classroom?.subjects?.length > 0 ? (
                  classroom?.subjects?.map((subject) => (
                    <Tag
                      key={subject.id}
                      color={getTagColor(subject.name)}
                      style={{ fontSize: 12 }}
                    >
                      {subject.name}
                    </Tag>
                  ))
                ) : (
                  <Tag color="red" style={{ fontSize: 12 }}>
                    No subject provided
                  </Tag>
                )}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge
                status={
                  classroom?.status === "active"
                    ? "processing"
                    : classroom?.status === "archived"
                    ? "error"
                    : "warning"
                }
                text={firstLetterToUpperCase(classroom?.status || "")}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Rating">
              <Rate disabled allowHalf defaultValue={rating} />
            </Descriptions.Item>
            <Descriptions.Item label="Students">
              {classroom?.students.length || 0}
            </Descriptions.Item>
            <Descriptions.Item span={4} label="Description">
              <ReactMarkdown>{`${classroom?.description}`}</ReactMarkdown>
            </Descriptions.Item>
            <Descriptions.Item span={4} label="Requirements">
              <ReactMarkdown>{`${classroom?.requirements}`}</ReactMarkdown>
            </Descriptions.Item>
            {classroom?.status !== "archived" &&
              userQuery.data?.role === "student" &&
              !userQuery.data.enrolledIn.find(
                (classroom) => classroom.id === classroomId
              ) && (
                <Descriptions.Item span={4} label="Actions">
                  <Space size="large">
                    <Button
                      type="primary"
                      onClick={() => setIsEnrollModalOpen(true)}
                    >
                      Enroll
                    </Button>
                    <Button
                      type="default"
                      onClick={() => router.push("/browse-classrooms")}
                    >
                      Choose a different classroom
                    </Button>
                  </Space>
                </Descriptions.Item>
              )}
          </Descriptions>
        </Skeleton>
      </section>

      <EnrollClassroomModal
        open={isEnrollModalOpen}
        onCancel={() => setIsEnrollModalOpen(false)}
        classroomName={classroom?.name || ""}
        classroomId={classroomId}
        modifier={classroom?.modifier || "private"}
      />
    </>
  );
};
