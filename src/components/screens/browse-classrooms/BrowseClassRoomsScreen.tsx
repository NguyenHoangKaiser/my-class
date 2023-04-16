import Image from "next/image";
import { trpc } from "src/utils/trpc";
import teacherImage from "src/assets/teacher.svg";
import { Col, Row, Select, Space } from "antd";
import React, { useState } from "react";
import { MainHeading } from "src/components/common";
import ClassroomsList from "../classrooms/ClassroomList";

function BrowseClassroomsScreen() {
  const [filter, setFilter] = useState<{
    modifier?: string;
    language?: string;
    subject?: string;
  }>({});

  const { data, isLoading } = trpc.classroom.browseClassroom.useQuery(filter);
  const { data: subjects } = trpc.classroom.getSubjects.useQuery();

  const subjectsOptions = subjects?.map((subject) => ({
    label: subject.name,
    value: subject.id,
  }));

  return (
    <Row>
      <Col span={24}>
        <MainHeading title={"Browse Classrooms"}>
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
        </MainHeading>

        <ClassroomsList
          cardNotClickable
          emptyComponent={
            <div className="flex flex-col items-center justify-center gap-8 px-5">
              <Image
                width="300"
                height="300"
                src={teacherImage}
                alt="no classrooms found"
              />
              <div className="text-2xl">Found no classroom!</div>
            </div>
          }
          isLoading={isLoading}
          classrooms={data}
        />
      </Col>
    </Row>
  );
}

export default BrowseClassroomsScreen;
