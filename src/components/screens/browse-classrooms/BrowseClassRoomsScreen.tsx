import Image from "next/image";
import { trpc } from "src/utils/trpc";
import teacherImage from "src/assets/teacher.svg";
import { Avatar, Badge, Card, List, Space, Tag, Typography } from "antd";
import React from "react";
import { EyeOutlined, StarOutlined, TeamOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { getClassroomStatusColor } from "src/utils/constants";

function BrowseClassroomsScreen() {
  const { data, isLoading } = trpc.classroom.browseClassroom.useQuery();

  const router = useRouter();

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
    <section className="px-5">
      <div className="my-8">Filters</div>
      {!isLoading && data && data.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-8 px-5">
          <Image
            width="300"
            height="300"
            src={teacherImage}
            alt="no classrooms found"
          />
          <div className="text-2xl">Found no classroom!</div>
        </div>
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
          dataSource={data}
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
                  // onClick={() => router.push(`/classrooms/${item.id}/overview`)}
                  // style={{ width: 400 }}
                  // hoverable
                  bordered={true}
                  // cover={
                  //   <Image
                  //     style={{
                  //       // width: "auto",
                  //       // height: "auto",
                  //       objectFit: "cover",
                  //       borderTopLeftRadius: 8,
                  //       borderTopRightRadius: 8,
                  //     }}
                  //     src={studentImage}
                  //     alt="a student"
                  //   />
                  // }
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
                    avatar={
                      <Avatar
                        shape="square"
                        size={45}
                        src={item.teacher.image}
                      />
                    }
                    // title={item.teacher.displayName ?? item.teacher.name}
                    // description={item.teacher.bio ?? "No bio"}
                    title={
                      <div className="mb-2 -mt-[6px] flex flex-col justify-center">
                        <Typography.Title level={4}>
                          {item.name}
                        </Typography.Title>
                        <div className="-mt-[6px] flex justify-between">
                          <Typography.Text type="secondary">
                            {item.teacher.displayName ?? item.teacher.name}
                          </Typography.Text>
                          <Space>
                            <Tag>
                              {item.language === "en"
                                ? "English"
                                : "Vietnamese"}
                            </Tag>
                          </Space>
                        </div>
                      </div>
                    }
                    // description={
                    //   <Typography.Text type="secondary">
                    //     {item.teacher.displayName ?? item.teacher.name}
                    //   </Typography.Text>
                    // }
                  />
                  <div className="flex flex-col justify-center gap-1">
                    <Typography.Paragraph
                      ellipsis={{
                        rows: 2,
                      }}
                      type={
                        item.description === "No description provided"
                          ? "danger"
                          : undefined
                      }
                    >
                      {item.description}
                    </Typography.Paragraph>
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
                  </div>
                </Card>
              </Badge.Ribbon>
            </List.Item>
          )}
        />
      )}
    </section>
  );
}

export default BrowseClassroomsScreen;
