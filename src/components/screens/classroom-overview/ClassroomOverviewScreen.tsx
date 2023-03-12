import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { trpc } from "../../../utils/trpc";
import Button, { Variant } from "src/components/common/Button";
import { Badge, Descriptions, Rate, Skeleton, Space, Spin, Tag } from "antd";
import dayjs from "dayjs";
import { MainHeading } from "src/components/common";
import { firstLetterToUpperCase } from "src/utils/helper";

export const ClassroomOverviewScreen = ({
  classroomId,
}: {
  classroomId: string;
}) => {
  const classroomQuery = trpc.classroom.getClassroom.useQuery({ classroomId });
  const userQuery = trpc.user.getUser.useQuery();
  const router = useRouter();
  const enrollMutation = trpc.classroom.enrollInClassroom.useMutation();

  const classroom = classroomQuery.data;

  const handleEnroll = async () => {
    await enrollMutation.mutateAsync({ classroomId });
    router.push(`/classrooms/${classroomId}`);
  };

  useEffect(() => {
    if (!userQuery.data) return;
    if (!classroomId) return;
    if (!router) return;
    if (
      !userQuery.data.enrolledIn.find(
        (classroom) => classroom.id === classroomId
      )
    )
      return;
    router.push(`/classrooms/${classroomId}`);
  }, [userQuery.data, classroomId, router]);

  const getTagColor = React.useCallback((name: string) => {
    const length = name.length;
    if (length > 8) {
      return "purple";
    } else if (length > 5) {
      return "cyan";
    } else {
      return "blue";
    }
  }, []);

  return (
    // <div className="container m-auto flex h-full flex-col items-center justify-end gap-5">
    //   <h2>{classroom?.name}</h2>
    //   <h2>{classroom?.description}</h2>
    //   <div className="flex gap-5">
    //     <Button variant={Variant.Primary} onClick={handleEnroll}>
    //       Enroll
    //     </Button>
    //     <Button
    //       variant={Variant.Secondary}
    //       onClick={() => router.push("/browse-classrooms")}
    //     >
    //       Choose a different classroom
    //     </Button>
    //   </div>
    // </div>
    <>
      <MainHeading title="Classroom Overview" />
      <section className="container px-5 pt-5">
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
              {classroom?.teacher.displayName || classroom?.teacher.name}
            </Descriptions.Item>
            <Descriptions.Item label="Create At">
              {dayjs(classroom?.createdAt).format("DD-MM-YYYY HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="Language">
              <Tag>
                {classroom?.language === "en" ? "English" : "Vietnamese"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag>{firstLetterToUpperCase(classroom?.modifier || "")}</Tag>
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
                    ? "warning"
                    : "error"
                }
                text={firstLetterToUpperCase(classroom?.status || "")}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Rating">
              <Rate disabled defaultValue={classroom?.ratings.length || 0} />
            </Descriptions.Item>
            <Descriptions.Item label="Official Receipts">
              $60.00
            </Descriptions.Item>
            <Descriptions.Item label="Config Info">
              Data disk type: MongoDB
              <br />
              Database version: 3.4
              <br />
              Package: dds.mongo.mid
              <br />
              Storage space: 10 GB
              <br />
              Replication factor: 3
              <br />
              Region: East China 1
              <br />
            </Descriptions.Item>
          </Descriptions>
        </Skeleton>
      </section>
    </>
  );
};
