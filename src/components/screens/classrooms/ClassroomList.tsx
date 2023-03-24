import type { Classroom, Subject } from "@prisma/client";
import { Badge, Card, List, Space, Tag, Typography } from "antd";
import Image from "next/image";
import student from "src/assets/student.jpeg";
import { useRouter } from "next/router";
import React from "react";
import { getClassroomStatusColor } from "src/utils/constants";

function ClassroomsList({
  classrooms,
  isLoading,
  emptyComponent,
}: {
  classrooms:
    | (Classroom & {
        subjects: Subject[];
      })[]
    | undefined;
  isLoading: boolean;
  emptyComponent: React.ReactNode;
}) {
  const router = useRouter();
  // make the get color function only run once when the subject name changes
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
    <>
      {!isLoading && classrooms && classrooms.length === 0 ? (
        emptyComponent
      ) : (
        <List
          style={{
            padding: 32,
          }}
          grid={{
            gutter: 32,
            xs: 1,
            sm: 1,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 4,
          }}
          dataSource={classrooms}
          loading={isLoading}
          renderItem={(item) => (
            <List.Item
              style={{
                width: 400,
                marginBottom: 32,
              }}
            >
              <Badge.Ribbon
                text={item.modifier.toLocaleUpperCase()}
                color={getClassroomStatusColor(item.status)}
              >
                <Card
                  onClick={() => router.push(`/classrooms/${item.id}`)}
                  // style={{ width: 400 }}
                  hoverable
                  bordered={false}
                  cover={
                    <Image
                      style={{
                        // width: "auto",
                        // height: "auto",
                        objectFit: "cover",
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                      src={student}
                      alt="a student"
                    />
                  }
                  // actions={[
                  //   <EditOutlined key="edit" />,
                  //   <EllipsisOutlined key="ellipsis" />,
                  // ]}
                >
                  <Card.Meta
                    // avatar={<Avatar src="https://joesch.moe/api/v1/random" />}
                    title={
                      // <div className="flex gap-1">
                      <Typography.Title level={4}>{item.name}</Typography.Title>
                      //   <Badge
                      //     status={item.status === "active" ? "success" : "error"}
                      //   />
                      // </div>
                    }
                    description={
                      item.description !== "No description provided" ? (
                        item.description
                      ) : (
                        <Tag color="red">No description provided</Tag>
                      )
                    }
                  />
                  <Space style={{ marginTop: 12 }} wrap>
                    {item.subjects.length > 0 ? (
                      item.subjects.map((subject) => (
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
                </Card>
              </Badge.Ribbon>
            </List.Item>
          )}
        />
      )}
    </>
  );
}

export default ClassroomsList;
