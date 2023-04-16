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

type Props = {
  userId?: string | undefined;
};

function ClassOverviewTab({ userId }: Props) {
  const { data: classrooms, isLoading } =
    trpc.classroom.getClassroomsForTeacher.useQuery({ userId });

  const router = useRouter();

  return (
    <Row>
      <Col span={24}>
        <p className="text-lg">Popular classrooms</p>
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
                      <Typography.Title level={5}>{item.name}</Typography.Title>
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
      </Col>
    </Row>
  );
}

export default ClassOverviewTab;
