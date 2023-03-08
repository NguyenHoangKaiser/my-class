import type { Classroom } from "@prisma/client";
import { Card, List } from "antd";
import ClassroomCard from "./ClassroomCard";

function ClassroomsList({ classrooms }: { classrooms: Classroom[] }) {
  return (
    // <div className="flex flex-col gap-4">
    //   <ul className="grid grid-cols-2 gap-4 px-5 md:grid-cols-3">
    //     {classrooms.map((classroom) => (
    //       <ClassroomCard key={classroom.id} classroom={classroom} />
    //     ))}
    //   </ul>
    // </div>
    <List
      style={{
        padding: 16,
      }}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 3,
        xxl: 4,
      }}
      dataSource={classrooms}
      renderItem={(item) => (
        <List.Item>
          <Card title={item.name}>Card content</Card>
        </List.Item>
      )}
    />
  );
}

export default ClassroomsList;
