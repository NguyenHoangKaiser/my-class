import { assertIsAssignmentAdmin } from "src/server/utils/assert";
import { getKeyUrl } from "src/utils/helper";
import z from "zod";
import { protectedProcedure, router } from "../trpc";

export const BucketName = "files";

export const assignmentRouter = router({
  updateDescription: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsAssignmentAdmin(ctx, input.assignmentId);
      await ctx.prisma.assignment.update({
        where: {
          id: input.assignmentId,
        },
        data: {
          description: input.description,
        },
      });
    }),
  updateTitle: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        title: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsAssignmentAdmin(ctx, input.assignmentId);
      await ctx.prisma.assignment.update({
        where: {
          id: input.assignmentId,
        },
        data: {
          name: input.title,
        },
      });
    }),
  updateDueDate: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        dueDate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsAssignmentAdmin(ctx, input.assignmentId);
      await ctx.prisma.assignment.update({
        where: {
          id: input.assignmentId,
        },
        data: {
          dueDate: input.dueDate,
        },
      });
    }),
  deleteAttachment: protectedProcedure
    .input(
      z.object({
        attachmentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      //TODO add authorization
      await ctx.prisma.attachment.delete({
        where: {
          id: input.attachmentId,
        },
      });
    }),
  deleteAssignment: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      //TODO add authorization
      await ctx.prisma.assignment.delete({
        where: {
          id: input.assignmentId,
        },
      });
    }),
  getAttachments: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: {
          id: input.assignmentId,
        },
        include: {
          attachments: true,
        },
      });
      return assignment?.attachments;
    }),
  createFileUrl: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string(),
        filename: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsAssignmentAdmin(ctx, input.assignmentId);
      const attachment = await ctx.prisma.attachment.create({
        data: {
          filename: input.filename,
          assignmentId: input.assignmentId,
        },
      });
      // return a path to the file in the bucket
      const url = getKeyUrl({
        assignmentId: input.assignmentId,
        attachmentId: attachment.id,
        filename: attachment.filename,
      });
      return url;
    }),
});
