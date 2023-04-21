import type { Classroom, Prisma, Subject } from "@prisma/client";
import { Badge, Card, List, Space, Tag, Tooltip, Typography } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { getClassroomStatusColor } from "src/utils/constants";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { Banner } from "src/components/common";
import { EyeOutlined, StarOutlined, TeamOutlined } from "@ant-design/icons";
import { getTagColor } from "src/utils/helper";

function ClassroomsList({
  classrooms,
  isLoading,
  emptyComponent,
  cardNotClickable,
}: {
  classrooms:
    | (Classroom & {
        _count: Prisma.ClassroomCountOutputType;
        subjects: Subject[];
      })[]
    | undefined;
  isLoading: boolean;
  emptyComponent: React.ReactNode;
  cardNotClickable?: boolean;
}) {
  const router = useRouter();

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
                  onClick={
                    cardNotClickable
                      ? () => router.push(`/classrooms/${item.id}/overview`)
                      : () => router.push(`/classrooms/${item.id}`)
                  }
                  hoverable
                  bordered={false}
                  cover={
                    <Banner
                      height={200}
                      width={"100%"}
                      style={{
                        objectFit: "cover",
                        borderTopLeftRadius: 8,
                        borderTopRightRadius: 8,
                      }}
                      classroomId={item.id}
                      alt="Classroom banner"
                    />
                  }
                  actions={[
                    <Space key="student">
                      <TeamOutlined />
                      {item._count.students ?? 0}
                    </Space>,
                    <Space key="rating">
                      <StarOutlined />
                      {item._count.ratings ?? 0}
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
                  ]}
                >
                  <Card.Meta
                    title={
                      <Typography.Title level={4}>{item.name}</Typography.Title>
                    }
                    description={
                      item.description !== "No description provided" ? (
                        <ReactMarkdown className="prose line-clamp-2 dark:prose-invert">{`${item.description}`}</ReactMarkdown>
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
