import Link from "next/link";
import profileImage from "src/assets/profile.jpeg";
import Image from "next/image";
import { EyeIcon } from "src/components/common/Icons";
import { Rate, Space, Table, Tag, Typography } from "antd";
import {
  ManOutlined,
  QuestionCircleOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { getGenderColor } from "src/utils/constants";
import { firstLetterToUpperCase } from "src/utils/helper";
import type { Rating, User } from "@prisma/client";

const { Column } = Table;

type DataType = User & {
  ratings: Rating | undefined;
};

function Students({ students }: { students: DataType[] }) {
  const totalStudents = students.length;

  return (
    <>
      <div className="mb-3 flex items-center gap-8">
        <h3 className="text-2xl">{totalStudents} Student(s) Enrolled</h3>
      </div>
      <Table
        dataSource={students}
        bordered
        pagination={{
          pageSize: 5,
          hideOnSinglePage: true,
        }}
        scroll={{ x: 1000 }}
      >
        <Column<DataType>
          title="#"
          key="index"
          render={(_text, _record, index) => <span>{index + 1}</span>}
          fixed="left"
          width={50}
        />
        <Column<DataType>
          title="Name"
          render={(text, record) => {
            return (
              <Space>
                <Image
                  alt="Profile"
                  src={record.image ?? profileImage}
                  width="30"
                  height="30"
                  referrerPolicy="no-referrer"
                  className="h-8 w-8 rounded-full"
                />
                <Typography.Text>
                  {record.displayName ?? record.name}
                </Typography.Text>
              </Space>
            );
          }}
          key="name"
          fixed="left"
          sorter={(a, b) => {
            const nameA = a.displayName ?? a.name ?? "";
            const nameB = b.displayName ?? b.name ?? "";
            return nameA.localeCompare(nameB);
          }}
          sortDirections={["ascend", "descend"]}
          // width={150}
        />
        <Column<DataType> title="Email" key="email" dataIndex="email" />
        <Column<DataType>
          title="Age"
          key="age"
          dataIndex="age"
          render={(value) => <span>{value ?? <Tag>Not specified</Tag>}</span>}
          sorter={(a, b) => {
            const ageA = a.age ?? 0;
            const ageB = b.age ?? 0;
            return ageA - ageB;
          }}
        />
        <Column<DataType>
          title="Gender"
          key="gender"
          dataIndex="gender"
          render={(value) => (
            <Tag color={getGenderColor(value)}>
              {firstLetterToUpperCase(value ?? "not specified")}
              {"  "}
              {value === "male" ? (
                <ManOutlined style={{ fontSize: "0.875rem" }} />
              ) : value === "female" ? (
                <WomanOutlined style={{ fontSize: "0.875rem" }} />
              ) : value === "other" ? (
                <QuestionCircleOutlined style={{ fontSize: "0.875rem" }} />
              ) : null}
            </Tag>
          )}
        />
        <Column<DataType>
          title="Rated"
          key="rateClassroom"
          dataIndex={["ratings", "amount"]}
          render={(value) => (
            <>
              {value ? (
                <Rate disabled defaultValue={value} />
              ) : (
                <Tag color="red">Not rate yet</Tag>
              )}
            </>
          )}
        />
        <Column<DataType>
          title="Action"
          key="action"
          width={100}
          fixed="right"
          render={(_, record) => (
            <Space size="middle">
              <Link
                className="flex items-center gap-1 text-blue-400"
                href={`/user/${record.id}`}
              >
                <EyeIcon /> View
              </Link>
            </Space>
          )}
        />
      </Table>
    </>
  );
}

export default Students;
