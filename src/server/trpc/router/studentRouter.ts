import { router, protectedProcedure } from "../trpc";

export const studentRouter = router({
  getClassrooms: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        enrolledIn: true,
      },
    });
    return user?.enrolledIn;
  }),
});
