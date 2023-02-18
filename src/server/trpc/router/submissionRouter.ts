import { assertIsClassroomAdmin, assertIsStudent } from "./../../utils/assert";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { router, protectedProcedure } from "../trpc";
import { getKeyUrl } from "src/utils/helper";

export const submissionRouter = router({
  getSubmission: protectedProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const submission = await ctx.prisma.submission.findFirst({
        where: {
          assignmentId: input.assignmentId,
          studentId: ctx.session.user.id,
        },
      });
      return submission;
    }),
  getSubmissionForStudent: protectedProcedure
    .input(z.object({ studentId: z.string(), classroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const submission = await ctx.prisma.submission.findMany({
        where: {
          assignmentId: input.studentId,
          assignment: {
            classroomId: input.classroomId,
          },
        },
      });
      return submission;
    }),
  getSubmissionForClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const classroom = await ctx.prisma.classroom.findUnique({
        where: {
          id: input.classroomId,
        },
        include: {
          assignments: {
            include: {
              submissions: {
                include: {
                  student: true,
                },
              },
            },
          },
        },
      });

      if (!classroom) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const submissions = classroom.assignments.flatMap((assignment) =>
        assignment.submissions.map((submission) => ({
          id: submission.id,
          fileName: submission.filename,
          assignmentName: assignment.name,
          assignmentId: assignment.id,
          assignmentNumber: assignment.number,
          studentId: submission.studentId,
          studentName: submission.student.name,
          grade: submission.grade,
        }))
      );
      return submissions;
    }),
  updateGrade: protectedProcedure
    .input(z.object({ submissionId: z.string(), grade: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const submission = await ctx.prisma.submission.findUnique({
        where: {
          id: input.submissionId,
        },
        include: {
          assignment: true,
        },
      });

      if (!submission) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      assertIsClassroomAdmin(ctx, submission.assignment.classroomId);

      await ctx.prisma.submission.update({
        where: {
          id: input.submissionId,
        },
        data: {
          grade: input.grade,
        },
      });
    }),
  createFileUrl: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        filename: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsStudent(ctx);
      const studentId = ctx.session.user.id as string;
      const submission = await ctx.prisma.submission.create({
        data: {
          filename: input.filename,
          assignmentId: input.assignmentId,
          studentId: studentId,
        },
      });
      const url = getKeyUrl({
        studentId,
        submissionId: submission.id,
        filename: input.filename,
      });
      return url;
    }),
});
