import { z } from "zod";
import { protectedProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";

export const commentRouter = router({
  createSubmissionComment: protectedProcedure
    .input(z.object({ content: z.string(), submissionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const comment = await ctx.prisma.comment.create({
        data: {
          userId: userId as string,
          submissionId: input.submissionId,
          content: input.content,
        },
      });
      return comment;
    }),
  createAssignmentComment: protectedProcedure
    .input(z.object({ content: z.string(), assignmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const comment = await ctx.prisma.comment.create({
        data: {
          userId: userId as string,
          assignmentId: input.assignmentId,
          content: input.content,
        },
      });
      return comment;
    }),
  getSubmissionComments: protectedProcedure
    .input(z.object({ submissionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          submissionId: input.submissionId,
        },
        include: {
          user: true,
        },
      });
      return comments;
    }),
  getAssignmentComments: protectedProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          assignmentId: input.assignmentId,
        },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: true,
        },
      });
      return comments;
    }),
  deleteComment: protectedProcedure
    .input(z.object({ commentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const comment = await ctx.prisma.comment.findUnique({
        where: {
          id: input.commentId,
        },
        include: {
          user: true,
        },
      });
      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }
      if (comment.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not allowed to delete this comment",
        });
      }
      const deletedComment = await ctx.prisma.comment.delete({
        where: {
          id: input.commentId,
        },
      });
      return deletedComment;
    }),
});
