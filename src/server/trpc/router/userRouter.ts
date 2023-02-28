import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  updateDisplayName: protectedProcedure
    .input(z.object({ displayName: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const user = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          displayName: input.displayName,
        },
      });
      return user;
    }),
  getUser: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        enrolledIn: true,
        submissions: true,
      },
    });
    return user;
  }),
});
