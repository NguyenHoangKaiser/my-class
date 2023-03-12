import {
  assertIsClassroomAdmin,
  assertIsStudent,
  assertIsTeacher,
} from "./../../utils/assert";
import z from "zod";
import { router, protectedProcedure } from "../trpc";
import { supabaseDeleteFile } from "src/utils/helper";

export const classroomRouter = router({
  getStudents: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const classroom = await ctx.prisma.classroom.findUnique({
        where: {
          id: input.classroomId,
        },
        include: {
          students: true,
        },
      });
      return classroom?.students.map((student) => ({
        ...student,
        email: "",
      }));
    }),
  findClassroom: protectedProcedure
    .input(z.object({ name: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      type TLocation = {
        name?: string;
      };
      const location: TLocation = {};
      if (input?.name) {
        location.name = input.name;
      }
      const classrooms = await ctx.prisma.classroom.findMany({
        where: location,
        include: {
          teacher: true,
          subjects: true,
        },
      });
      return classrooms;
    }),
  createClassroom: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        language: z.string(),
        password: z.string().nullable(),
        requirements: z.string(),
        modifier: z.string(),
        subject: z.array(
          z.object({ name: z.string(), description: z.string() })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsTeacher(ctx); // Verify that the user is a teacher
      const classroom = await ctx.prisma.classroom.create({
        include: {
          subjects: true,
        },
        data: {
          userId: ctx.session.user.id as string, // We know that the user is a teacher because of the assertIsTeacher call above
          name: input.name,
          description: input.description,
          language: input.language,
          password: input.password,
          requirements: input.requirements,
          modifier: input.modifier,
          subjects: {
            connectOrCreate: input.subject.map((subject) => ({
              where: {
                name: subject.name,
              },
              create: {
                name: subject.name,
                description: subject.description,
              },
            })),
          },
        },
        // use connectOrCreate to create the subject if it doesn't exist yet, otherwise connect to it
      });
      return classroom;
    }),
  getClassroomsForTeacher: protectedProcedure
    .input(
      z
        .object({
          modifier: z.string().optional(),
          language: z.string().optional(),
          // name: z.string().nullable(),
        })
        .nullish()
    )
    .query(async ({ ctx, input }) => {
      if (input && input.modifier !== "all" && input.language !== "all") {
        const classrooms = await ctx.prisma.classroom.findMany({
          where: {
            userId: ctx.session.user.id as string,
            modifier: input.modifier ? input.modifier : undefined,
            language: input.language ? input.language : undefined,
            // name: input.name ? input.name : undefined,
          },
          include: {
            subjects: true,
          },
        });
        return classrooms;
      } else {
        const classrooms = await ctx.prisma.classroom.findMany({
          where: {
            userId: ctx.session.user.id as string,
          },
          include: {
            subjects: true,
          },
        });
        return classrooms;
      }
    }),
  getClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const classroom = await ctx.prisma.classroom.findUnique({
        where: {
          id: input.classroomId,
        },
        include: {
          subjects: true,
          students: true,
          assignments: true,
          teacher: true,
          ratings: true,
        },
      });
      return classroom;
    }),
  editClassroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        name: z.string(),
        description: z.string(),
        language: z.string(),
        password: z.string().nullable(),
        requirements: z.string(),
        modifier: z.string(),
        status: z.string(),
        subject: z.array(
          z.object({ name: z.string(), description: z.string() })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsClassroomAdmin(ctx, input.classroomId);
      const updatedClassroom = await ctx.prisma.classroom.update({
        where: {
          id: input.classroomId,
        },
        include: {
          subjects: true,
        },
        data: {
          name: input.name,
          description: input.description,
          language: input.language,
          password: input.password,
          requirements: input.requirements,
          modifier: input.modifier,
          status: input.status,
          subjects: {
            connectOrCreate: input.subject.map((subject) => ({
              where: {
                name: subject.name,
              },
              create: {
                name: subject.name,
                description: subject.description,
              },
            })),
          },
        },
      });
      return updatedClassroom;
    }),
  createAssignment: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        dueDate: z.string(),
        classroomId: z.string(),
        description: z.string(),
        subject: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsClassroomAdmin(ctx, input.classroomId);
      const assignment = await ctx.prisma.assignment.create({
        data: {
          name: input.name,
          dueDate: input.dueDate,
          classroomId: input.classroomId,
          description: input.description,
          subject: input.subject,
        },
      });
      return assignment;
    }),
  getAssignments: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const assignments = await ctx.prisma.assignment.findMany({
        where: {
          classroomId: input.classroomId,
        },
        include: {
          attachments: true,
          submissions: true,
        },
      });
      return assignments;
    }),
  getAssignment: protectedProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: {
          id: input.assignmentId,
        },
      });
      return assignment;
    }),
  enrollInClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      assertIsStudent(ctx);
      const userId = ctx.session.user.id as string;
      const classroom = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          enrolledIn: {
            connect: {
              id: input.classroomId,
            },
          },
        },
      });
      return classroom;
    }),
  unEnroll: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      assertIsStudent(ctx);
      const userId = ctx.session.user.id as string;
      const classroom = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          enrolledIn: {
            disconnect: {
              id: input.classroomId,
            },
          },
        },
      });
      return classroom;
    }),
  deleteClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      assertIsClassroomAdmin(ctx, input.classroomId);
      const assignments = await ctx.prisma.assignment.findMany({
        where: {
          classroomId: input.classroomId,
        },
        include: {
          submissions: true,
          attachments: true,
        },
      });
      for (const assignment of assignments) {
        for (const submission of assignment.submissions) {
          supabaseDeleteFile({
            submissionId: submission.id,
            studentId: submission.studentId,
            filename: submission.filename,
          });
        }
        for (const attachment of assignment.attachments) {
          supabaseDeleteFile({
            attachmentId: attachment.id,
            assignmentId: attachment.assignmentId,
            filename: attachment.filename,
          });
        }
      }
      const classroom = await ctx.prisma.classroom.delete({
        where: {
          id: input.classroomId,
        },
      });
      return classroom;
    }),
  // addSubject: protectedProcedure
  //   .input(
  //     z.array(
  //       z.object({
  //         name: z.string(),
  //         description: z.string(),
  //       })
  //     )
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     assertIsTeacher(ctx);
  //     const subject = await ctx.prisma.subject.createMany({
  //       data: input,
  //       skipDuplicates: true,
  //     });
  //     return subject;
  //   }),
  getSubjects: protectedProcedure.query(async ({ ctx }) => {
    const subjects = await ctx.prisma.subject.findMany();
    return subjects;
  }),
  browseClassroom: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id as string;
    const allClassrooms = await ctx.prisma.classroom.findMany({
      include: {
        subjects: true,
        students: true,
        teacher: true,
        ratings: true,
      },
    });

    const classroomsNotEnrolled = allClassrooms.filter(
      (classroom) =>
        classroom.students.findIndex((student) => student.id === userId) === -1
    );

    return classroomsNotEnrolled;
  }),
});
