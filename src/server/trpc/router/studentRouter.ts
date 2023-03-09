import { router, protectedProcedure } from "../trpc";

export const studentRouter = router({
  getClassrooms: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    // const user = await ctx.prisma.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    //   include: {
    //     enrolledIn: true,
    //   },
    // });
    // return user?.enrolledIn;
    // find all classrooms that the user is enrolled in
    const classrooms = await ctx.prisma.classroom.findMany({
      where: {
        students: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        students: true,
        teacher: true,
        subjects: true,
      },
    });
    return classrooms;
  }),
});
