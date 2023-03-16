import type {
  Assignment,
  Attachment,
  Classroom,
  Subject,
  Submission,
  User,
} from "@prisma/client";
import Link from "next/link";
import { trpc } from "src/utils/trpc";
import { useSession } from "src/hooks";
import { EyeIcon } from "src/components/common/Icons";
import { Space, Table, Tag, Typography } from "antd";
import { useRouter } from "next/router";
import dayjs from "dayjs";

type DataType = Assignment & {
  attachments: Attachment[];
  submissions: Submission[];
};
const { Column } = Table;

function StudentAssignments({
  assignments,
  classroom,
}: {
  assignments:
    | (Assignment & {
        submissions: Submission[];
        attachments: Attachment[];
      })[]
    | undefined;
  classroom:
    | (Classroom & {
        students: User[];
        subjects: Subject[];
      })
    | null
    | undefined;
}) {
  const totalAssignments = assignments?.length;

  const router = useRouter();
  const session = useSession();

  const submissionsQuery = trpc.submission.getSubmissionForStudent.useQuery(
    {
      studentId: session.data?.user?.id as string,
    },
    {
      enabled: !!session.data,
    }
  );

  const getSubmission = (assignmentId: string) => {
    const grade = submissionsQuery.data?.filter(
      (submission) =>
        submission.assignmentId === assignmentId && submission.grade !== null
    );
    if (!grade) return null;
    // @ts-expect-error - Even though grade maybe null, the reduce function still works
    const average = grade?.reduce((a, b) => a + b?.grade, 0) / grade?.length;
    if (!average) return null;
    return average;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl">
          Your Assignments ({totalAssignments} total)
        </h2>
      </div>
      <div className="mr-2">
        <Table
          onRow={(record) => {
            return {
              onClick: () => {
                router.push(
                  `/classrooms/${record.classroomId}/assignments/${record.id}`
                );
              },
            };
          }}
          dataSource={assignments}
          bordered
          pagination={{
            pageSize: 5,
            hideOnSinglePage: true,
          }}
          // scroll={{ x: 100, y: 500 }}
        >
          <Column<DataType>
            title="#"
            key="index"
            render={(_text, _record, index) => <span>{index + 1}</span>}
            // fixed="left"
            // width={50}
          />
          <Column<DataType>
            title="Name"
            dataIndex="name"
            key="name"
            sorter={(a, b) => a.name.localeCompare(b.name)}
            sortDirections={["ascend", "descend"]}
            // width={150}
          />
          <Column<DataType>
            title="Due date"
            dataIndex="dueDate"
            key="dueDate"
            render={(dueDate) => (
              <Typography.Text
                type={dayjs(dueDate).isBefore(dayjs()) ? "danger" : "success"}
              >
                {dayjs(dueDate).format("DD-MM-YYYY hh:mm A")}
              </Typography.Text>
            )}
            sorter={(a, b) => dayjs(a.dueDate).diff(dayjs(b.dueDate))}
            sortDirections={["ascend", "descend"]}
            // width={200}
          />
          <Column<DataType>
            title="Subject"
            dataIndex="subject"
            key="subject"
            render={(subject) => {
              const color =
                subject.length > 8
                  ? "purple"
                  : subject.length > 5
                  ? "cyan"
                  : "blue";
              return <Tag color={color}>{subject}</Tag>;
            }}
            filters={classroom?.subjects.map((subject) => ({
              text: subject.name,
              value: subject.name,
            }))}
            //@ts-expect-error - this is the filter
            onFilter={(value, record) => record.subject.indexOf(value) === 0}
            // width={110}
          />
          <Column<DataType>
            title="Attachment"
            dataIndex="attachments"
            key="attachments"
            render={(attachments) => attachments.length}
            sorter={(a, b) => a.attachments.length - b.attachments.length}
            sortDirections={["ascend", "descend"]}
            // width={120}
          />
          <Column<DataType>
            title="Grade"
            key="grade"
            //@ts-expect-error - this is the filter
            sorter={(a, b) => getSubmission(a.id) - getSubmission(b.id)}
            sortDirections={["ascend", "descend"]}
            render={(_value, record) => {
              const average = getSubmission(record.id);
              if (!average) return "N/A";
              return (
                <Typography.Text type={average < 50 ? "danger" : "success"}>
                  {average.toFixed(2)}
                </Typography.Text>
              );
            }}
            // width={120}
          />
          <Column<DataType>
            title="Status"
            dataIndex="status"
            key="status"
            render={(status) => (
              <Tag
                color={
                  status === "progressing"
                    ? "green"
                    : status === "completed"
                    ? "red"
                    : "orange"
                }
              >
                {status.toUpperCase()}
              </Tag>
            )}
            filters={[
              {
                text: "Progressing",
                value: "progressing",
              },
              {
                text: "Completed",
                value: "completed",
              },
              {
                text: "Suspended",
                value: "suspended",
              },
            ]}
            //@ts-expect-error - this is the filter
            onFilter={(value, record) => record.status.indexOf(value) === 0}
            // width={120}
          />
          <Column<DataType>
            title="Action"
            key="action"
            // width={160}
            // fixed="right"
            render={(_, record) => (
              <Space size="middle">
                <Link
                  className="flex items-center gap-1 text-blue-400"
                  href={`/classrooms/${record.classroomId}/assignments/${record.id}`}
                >
                  <EyeIcon /> View
                </Link>
              </Space>
            )}
          />
        </Table>
      </div>
    </div>
  );
}

export default StudentAssignments;
