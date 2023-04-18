import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const studentRouter = router({
  getClassrooms: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const classrooms = await ctx.prisma.classroom.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          students: {
            some: {
              id: input.userId || userId,
            },
          },
        },
        include: {
          subjects: true,
          _count: true,
        },
      });
      return classrooms;
    }),
});
