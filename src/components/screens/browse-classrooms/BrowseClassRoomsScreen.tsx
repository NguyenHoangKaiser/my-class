import Image from "next/image";
import studentImage from "src/assets/student.jpeg";
import Link from "next/link";
import { trpc } from "src/utils/trpc";
import Button, { Variant } from "src/components/common/Button";

function BrowseClassroomsScreen() {
  const findClassroom = trpc.classroom.findClassroom.useQuery();
  const classrooms = trpc.student.getClassrooms.useQuery();
  const teacherClass = trpc.classroom.getClassroomsForTeacher.useQuery();

  const isEnrolled = (classroomId: string) => {
    return classrooms.data?.some(({ id }) => id === classroomId);
  };

  const isTeacher = (classroomId: string) => {
    return teacherClass.data?.some(({ id }) => id === classroomId);
  };

  const classroomNotTeacher = findClassroom.data?.filter(
    (classroom) => !isTeacher(classroom.id)
  );

  return (
    <section>
      <div className="my-8">Filters</div>
      {classroomNotTeacher?.map((classroom) => (
        <div key={classroom.id}>
          <article className="flex gap-8">
            <figure>
              <Image
                width="300"
                height="300"
                src={studentImage}
                alt="no classrooms found"
              />
            </figure>

            <div>
              <h3 className="font-bold">{classroom.name}</h3>
              <h3 className="">{classroom.description}</h3>
              <h3 className="">{classroom.teacher.name}</h3>
            </div>

            <div>
              <Link
                href={
                  isEnrolled(classroom.id)
                    ? `/classrooms/${classroom.id}`
                    : `/classrooms/${classroom.id}/overview`
                }
              >
                <Button
                  variant={
                    isEnrolled(classroom.id)
                      ? Variant.Secondary
                      : Variant.Primary
                  }
                  color="primary"
                >
                  {isEnrolled(classroom.id)
                    ? "(Already Enrolled) View"
                    : "View Classroom"}
                </Button>
              </Link>
            </div>
          </article>
          <hr className="my-8 border-gray-600" />
        </div>
      ))}
    </section>
  );
}

export default BrowseClassroomsScreen;
