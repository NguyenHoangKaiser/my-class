import { useState } from "react";
import { EmptyStateWrapper, MainHeading } from "src/components/common";
import { trpc } from "src/utils/trpc";
import EmptyStateClassrooms from "./EmptyStateClassrooms";
import ClassroomsList from "./ClassroomList";
import { Button, Select, Space } from "antd";
import CreateClassroomModal from "./CreateClassroomModal";

function ClassroomsScreen() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState({
    modifier: "",
    language: "",
  });

  const { data: classrooms, refetch: refetchClassrooms } =
    trpc.classroom.getClassroomsForTeacher.useQuery(filter);

  return (
    <>
      <MainHeading title={"My Classrooms"}>
        <Space direction="horizontal">
          <Select
            options={[
              {
                label: "Public",
                value: "public",
              },
              {
                label: "Private",
                value: "private",
              },
            ]}
            // defaultValue="all"
            style={{ width: 120 }}
            allowClear
            placeholder="Type"
            onChange={(value) => {
              console.log(value);
              setFilter((prev) => ({ ...prev, modifier: value as string }));
            }}
          />
          <Select
            options={[
              {
                label: "English",
                value: "en",
              },
              {
                label: "Vietnamese",
                value: "vi",
              },
            ]}
            style={{ width: 120 }}
            allowClear
            placeholder="Language"
            onChange={(value) => {
              setFilter((prev) => ({ ...prev, language: value as string }));
            }}
          />
        </Space>
        <Button type="primary" size="large" onClick={() => setOpen(true)}>
          Create a Class
        </Button>
      </MainHeading>

      <div>
        {/* <EmptyStateWrapper
          // isLoading={isLoading}
          data={classrooms}
          EmptyComponent={
            <EmptyStateClassrooms openClassroomModal={openClassroomModal} />
          }
          NonEmptyComponent={<ClassroomsList classrooms={classrooms ?? []} />}
        /> */}
        <ClassroomsList classrooms={classrooms} />
      </div>

      <CreateClassroomModal
        refetch={refetchClassrooms}
        open={open}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}

export default ClassroomsScreen;
