import { assertIsClassroomAdmin } from "./../../utils/assert";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { router, protectedProcedure } from "../trpc";

export const getObjectKey = ({
  studentId,
  submissionId,
}: {
  studentId: string;
  submissionId: string;
}) => {
  return `submissions/${studentId}/${submissionId}`;
};

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
          studentName: submission.student.displayName,
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
  // createPresignedUrl: protectedProcedure
  //   .input(
  //     z.object({
  //       assignmentId: z.string(),
  //       fileName: z.string(),
  //     })
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const studentId = ctx.session.user.id;
  //     const submissionId = ctx.prisma.submission.create({
  //       data: {
  //         filename: input.fileName,
  //         assignmentId: input.assignmentId,
  //         studentId,
  //       },
  //     });
  //   }),
});
