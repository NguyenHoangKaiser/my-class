import type { Classroom, Rating, Subject, User } from "@prisma/client";
import { Badge, Card, List, Space, Tag, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { getClassroomStatusColor } from "src/utils/constants";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Banner } from "src/components/common";
import { EyeOutlined, StarOutlined, TeamOutlined } from "@ant-design/icons";

function ClassroomsList({
  classrooms,
  isLoading,
  emptyComponent,
}: {
  classrooms:
    | (Classroom & {
        ratings: Rating[];
        subjects: Subject[];
        students: User[];
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
              key={item.id}
              style={{
                width: 400,
                marginBottom: 32,
              }}
            >
              <Badge.Ribbon
                text={
                  <Tooltip title={`Class is ${item.status}`}>
                    {item.modifier.toLocaleUpperCase()}
                  </Tooltip>
                }
                color={getClassroomStatusColor(item.status)}
              >
                <Card
                  onClick={() => router.push(`/classrooms/${item.id}`)}
                  // style={{ width: 400 }}
                  hoverable
                  bordered={false}
                  cover={
                    <Banner
                      height={140}
                      width={300}
                      style={{
                        objectFit: "cover",
                        // height: "auto",
                        // width: "auto",
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                      classroomId={item.id}
                      alt=""
                    />
                  }
                  actions={[
                    <Space key="student">
                      <TeamOutlined />
                      {item.students.length ?? 0}
                    </Space>,
                    <Space key="rating">
                      <StarOutlined />
                      {item.ratings.length ?? 0}
                    </Space>,
                    <Space
                      onClick={() =>
                        router.push(`/classrooms/${item.id}/overview`)
                      }
                      key="view"
                    >
                      <EyeOutlined />
                      View
                    </Space>,
                    // <IconText
                    //   icon={MessageOutlined}
                    //   text="2"
                    //   key="list-vertical-message"
                    // />,
                  ]}
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
                        <ReactMarkdown className="text-black dark:text-white">{`${item.description}`}</ReactMarkdown>
                      ) : (
                        <Tag color="red">No description provided</Tag>
                      )
                    }
                  />
                  <div className="flex flex-col justify-between gap-2">
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
                    <Space>
                      <Tag>
                        {item.language === "en" ? "English" : "Vietnamese"}
                      </Tag>
                    </Space>
                  </div>
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
