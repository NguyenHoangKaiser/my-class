import { useState } from "react";
import { MainHeading } from "src/components/common";
import { trpc } from "src/utils/trpc";
import ClassroomsList from "./ClassroomList";
import { Button, Col, Row, Select, Space } from "antd";
import CreateClassroomModal from "./CreateClassroomModal";
import EmptyStateClassrooms from "./EmptyStateClassrooms";

function ClassroomsScreen() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<{
    modifier?: string;
    language?: string;
    subject?: string;
  }>({});

  const { data: subjects } = trpc.classroom.getSubjects.useQuery();
  const subjectsOptions = subjects?.map((subject) => ({
    label: subject.name,
    value: subject.id,
  }));

  const {
    data: classrooms,
    refetch: refetchClassrooms,
    isLoading,
  } = trpc.classroom.getClassroomsForTeacher.useQuery(filter);
  function openClassroomModal() {
    setOpen(true);
  }

  return (
    <Row>
      <Col span={24}>
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
              style={{ width: 120 }}
              allowClear
              placeholder="Type"
              onChange={(value) => {
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
            <Select
              options={subjectsOptions}
              style={{ width: 120 }}
              allowClear
              placeholder="Subject"
              onChange={(value) => {
                setFilter((prev) => ({ ...prev, subject: value as string }));
              }}
            />
          </Space>
          <Button type="primary" size="large" onClick={() => setOpen(true)}>
            Create a Class
          </Button>
        </MainHeading>

        <ClassroomsList
          emptyComponent={
            <EmptyStateClassrooms openClassroomModal={openClassroomModal} />
          }
          isLoading={isLoading}
          classrooms={classrooms}
        />

        <CreateClassroomModal
          refetch={refetchClassrooms}
          open={open}
          onCancel={() => setOpen(false)}
        />
      </Col>
    </Row>
  );
}

export default ClassroomsScreen;
