import React from "react";
import { EyeOutlined, StarOutlined, TeamOutlined } from "@ant-design/icons";
import {
  Badge,
  Card,
  Col,
  List,
  Row,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { useRouter } from "next/router";
import { getClassroomStatusColor } from "src/utils/constants";
import { getTagColor } from "src/utils/helper";
import { trpc } from "src/utils/trpc";
import { EmptyStateWrapper } from "src/components/common";
import Image from "next/image";
import teacherImage from "src/assets/teacher.svg";

type Props = {
  userId?: string | undefined;
};

function StudentOverviewTab({ userId }: Props) {
  const { data: classrooms, isLoading } = trpc.student.getClassrooms.useQuery({
    userId,
  });

  const router = useRouter();
  return (
    <Row>
      <Col span={24}>
        <p className="text-lg">Recently Enrolled</p>
        <EmptyStateWrapper
          data={classrooms}
          isLoading={isLoading}
          EmptyComponent={
            <div className="mx-auto flex flex-col items-center justify-center gap-8">
              <Image
                width="300"
                height="300"
                src={teacherImage}
                alt="no classrooms found"
              />
              <div className="text-2xl">Not enrolled in any classroom yet</div>
            </div>
          }
          NonEmptyComponent={
            <List
              grid={{
                gutter: 44,
                xs: 1,
                sm: 1,
                md: 1,
                lg: 2,
                xl: 2,
                xxl: 2,
              }}
              style={{
                marginTop: 16,
              }}
              dataSource={classrooms?.slice(0, 4)}
              loading={isLoading}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <Badge.Ribbon
                    text={
                      <Tooltip title={`Class is ${item.status}`}>
                        {item.modifier.toLocaleUpperCase()}
                      </Tooltip>
                    }
                    color={getClassroomStatusColor(item.status)}
                  >
                    <Card
                      bordered
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
                          <Typography.Title level={5}>
                            {item.name}
                          </Typography.Title>
                        }
                      />
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <Space wrap>
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

                        <Tag>
                          {item.language === "en" ? "English" : "Vietnamese"}
                        </Tag>
                      </div>
                    </Card>
                  </Badge.Ribbon>
                </List.Item>
              )}
            />
          }
        />
      </Col>
    </Row>
  );
}

export default StudentOverviewTab;
