import { useRouter } from "next/router";
import React from "react";
import ReactMarkdown from "react-markdown";
import { trpc } from "src/utils/trpc";
import {
  Badge,
  Button,
  Col,
  Descriptions,
  Rate,
  Row,
  Skeleton,
  Space,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { Banner, MainHeading } from "src/components/common";
import { firstLetterToUpperCase, getTagColor } from "src/utils/helper";
import EnrollClassroomModal from "./EnrollClassroomModal";
import Link from "next/link";
import Image from "next/image";
import profileImage from "src/assets/profile.jpeg";

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

  // calculate rating filter out 0 rating
  const rating = classroom?.ratings
    ? classroom.ratings
        .filter((rating) => rating.amount !== 0)
        .reduce((a, b) => a + b.amount, 0) / classroom.ratings.length
    : 0;

  const isStudent = userQuery.data?.role === "student";
  const isOwner = classroom?.teacher.id === userQuery.data?.id;
  const isEnrolled = classroom?.students.some(
    (student) => student.id === userQuery.data?.id
  );
  const isNotArchived = classroom?.status !== "archived";

  return (
    <Row>
      <Col
        className="no-scrollbar max-h-[calc(100vh-4rem)] overflow-y-scroll pr-2"
        span={13}
        offset={2}
      >
        <MainHeading title="Classroom Overview" />
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
                <Image
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="rounded-full hover:cursor-pointer"
                  onClick={() => {
                    router.push(`/user/${classroom?.teacher.id}`);
                  }}
                  src={classroom?.teacher.image ?? profileImage}
                />
                <Link href={`/user/${classroom?.teacher.id}`}>
                  {classroom?.teacher.displayName || classroom?.teacher.name}
                </Link>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(classroom?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="Language">
              <Tag>
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
                      style={{ fontSize: "0.75rem" }}
                    >
                      {subject.name}
                    </Tag>
                  ))
                ) : (
                  <Tag color="red" style={{ fontSize: "0.75rem" }}>
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
            <Descriptions.Item label="Students">
              <Tag color="geekblue-inverse">
                {classroom?._count.students ?? 0} Students
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Assignments">
              <Tag color="geekblue-inverse">
                {classroom?._count.assignments ?? 0} Assignments
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item span={4} label="Description">
              <ReactMarkdown className="prose dark:prose-invert">{`${classroom?.description}`}</ReactMarkdown>
            </Descriptions.Item>
            <Descriptions.Item span={4} label="Requirements">
              <ReactMarkdown className="prose dark:prose-invert">{`${classroom?.requirements}`}</ReactMarkdown>
            </Descriptions.Item>
          </Descriptions>
        </Skeleton>
      </Col>
      <Col span={8} className="pl-2 pt-28">
        <div className="flex flex-col items-center gap-5">
          {classroomQuery.isLoading ? (
            <Skeleton.Image style={{ width: 500, height: 300 }} active />
          ) : (
            <Banner
              width={500}
              height={300}
              alt="Classroom banner"
              classroomId={classroomId}
            />
          )}
          {classroomQuery.isLoading ? (
            <Space
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Skeleton.Input active />
              <Skeleton.Input active />
            </Space>
          ) : (
            <div className="mt-4 flex flex-col items-center gap-5">
              <Rate disabled allowHalf defaultValue={rating} />
              {isNotArchived && isStudent && !isEnrolled && (
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
              )}
              {isEnrolled && (
                <Button
                  type="primary"
                  onClick={() => router.push(`/classrooms/${classroomId}`)}
                >
                  Go to classroom
                </Button>
              )}
              {isOwner && (
                <Button
                  type="primary"
                  onClick={() => router.push(`/classrooms/${classroomId}`)}
                >
                  Go to classroom
                </Button>
              )}
            </div>
          )}
        </div>
      </Col>
      <EnrollClassroomModal
        open={isEnrollModalOpen}
        onCancel={() => setIsEnrollModalOpen(false)}
        classroomName={classroom?.name || ""}
        classroomId={classroomId}
        modifier={classroom?.modifier || "private"}
      />
    </Row>
  );
};
