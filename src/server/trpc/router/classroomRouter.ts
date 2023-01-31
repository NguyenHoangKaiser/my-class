import { assertIsTeacher } from "./../../utils/assert";
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
});
