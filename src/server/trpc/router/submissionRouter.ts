import { assertIsClassroomAdmin, assertIsStudent } from "./../../utils/assert";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { router, protectedProcedure } from "../trpc";
import { getKeyUrl, supabaseDeleteFile } from "src/utils/helper";
import { SubmissionStatus } from "src/utils/constants";

export const submissionRouter = router({
  getSubmission: protectedProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const submission = await ctx.prisma.submission.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          assignmentId: input.assignmentId,
          studentId: ctx.session.user.id,
        },
      });
      return submission;
    }),
  getSubmissionForStudent: protectedProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const submission = await ctx.prisma.submission.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          studentId: input.studentId,
          // assignmentId: input.assignmentId,
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
        assignment.submissions.map((submission) => {
          return {
            ...submission,
            assignmentName: assignment.name,
            dueDate: assignment.dueDate,
          };
        })
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

      if (submission.status === SubmissionStatus.pending) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must first download the pending submission",
        });
      }

      assertIsClassroomAdmin(ctx, submission.assignment.classroomId);

      await ctx.prisma.submission.update({
        where: {
          id: input.submissionId,
        },
        data: {
          grade: input.grade,
          status: SubmissionStatus.graded,
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
  deleteSubmission: protectedProcedure
    .input(z.object({ submissionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const submission = await ctx.prisma.submission.findUnique({
        where: {
          id: input.submissionId,
        },
      });
      if (!submission) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      supabaseDeleteFile({
        submissionId: submission.id,
        studentId: submission.studentId,
        filename: submission.filename,
      });
      await ctx.prisma.submission.delete({
        where: {
          id: input.submissionId,
        },
      });
    }),
  changeStatusSubmission: protectedProcedure
    .input(
      z.object({
        submissionId: z.string(),
        status: z.enum([
          SubmissionStatus.graded,
          SubmissionStatus.late,
          SubmissionStatus.viewed,
        ]),
      })
    )
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
          status: input.status,
        },
      });
    }),
});
