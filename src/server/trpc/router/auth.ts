import { TRPCError } from "@trpc/server";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import z from "zod";
import Roles from "src/utils/constants";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  setRoleAsTeacher: protectedProcedure
    .input(z.object({}).nullish())
    .mutation(async ({ ctx }) => {
      if (ctx.session.user.role) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only set your role once",
        });
      }
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          role: Roles.Teacher,
        },
      });
      return "Role has been set to teacher";
    }),
  setRoleAsStudent: protectedProcedure
    .input(z.object({}).nullish())
    .mutation(async ({ ctx }) => {
      if (ctx.session.user.role) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can only set your role once",
        });
      }
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          role: Roles.Student,
        },
      });
      return "Role has been set to student";
    }),
});
