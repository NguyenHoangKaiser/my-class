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
        },
      });
      return classrooms;
    }),
  createClassroom: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().nullable(),
        language: z.string().nullable(),
        password: z.string().nullable(),
        requirements: z.string().nullable(),
        modifier: z.string().nullable(),
        subject: z.array(
          z.object({ name: z.string(), description: z.string() })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsTeacher(ctx); // Verify that the user is a teacher
      const classroom = await ctx.prisma.classroom.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id as string, // We know that the user is a teacher because of the assertIsTeacher call above
        },
      });
      return classroom;
    }),
  getClassroomsForTeacher: protectedProcedure.query(async ({ ctx }) => {
    const classrooms = await ctx.prisma.classroom.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return classrooms;
  }),
  getClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const classroom = await ctx.prisma.classroom.findUnique({
        where: {
          id: input.classroomId,
        },
      });
      return classroom;
    }),
  editClassroom: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        classroomId: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsClassroomAdmin(ctx, input.classroomId);
      const updatedClassroom = await ctx.prisma.classroom.update({
        where: {
          id: input.classroomId,
        },
        data: {
          name: input.name,
          description: input.description,
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsClassroomAdmin(ctx, input.classroomId);
      const assignment = await ctx.prisma.assignment.create({
        data: {
          name: input.name,
          dueDate: input.dueDate,
          description: "This is a default assignment description",
          classroomId: input.classroomId,
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
  addSubject: protectedProcedure
    .input(
      z.array(
        z.object({
          name: z.string(),
          description: z.string(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      assertIsTeacher(ctx);
      const subject = await ctx.prisma.subject.createMany({
        data: input,
        skipDuplicates: true,
      });
      return subject;
    }),
  getSubjects: protectedProcedure.query(async ({ ctx }) => {
    const subjects = await ctx.prisma.subject.findMany();
    return subjects;
  }),
});
