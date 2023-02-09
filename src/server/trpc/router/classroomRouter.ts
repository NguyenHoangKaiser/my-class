import {
  assertIsClassroomAdmin,
  assertIsStudent,
  assertIsTeacher,
} from "./../../utils/assert";
import z from "zod";
import { router, protectedProcedure } from "../trpc";

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
    .input(z.object({ name: z.string() }))
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
});
