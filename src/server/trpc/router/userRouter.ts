import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const userRouter = router({
  editProfile: protectedProcedure
    .input(
      z.object({
        displayName: z.string(),
        bio: z.string(),
        location: z.string(),
        age: z.number().int(),
        gender: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const user = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          displayName: input.displayName,
          bio: input.bio,
          location: input.location,
          age: input.age,
          gender: input.gender,
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
  getProfile: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = input.userId || ctx.session.user.id;
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          classrooms: {
            include: {
              students: true,
            },
          },

          _count: true,
        },
      });

      const totalStudents = user?.classrooms.reduce((acc, cur) => {
        acc += cur.students.length;
        return acc;
      }, 0);

      return {
        ...user,
        // calculate the number of students the user is teaching
        totalStudents: totalStudents,
      };
    }),
  getGradeEachClassroom: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        enrolledIn: {
          include: {
            assignments: {
              include: {
                submissions: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error("User does not exist");
    }

    // get all the classrooms the user is enrolled in
    const enrolledIn = user?.enrolledIn;

    // get all the submissions from the user
    const submission = await ctx.prisma.submission.findMany({
      where: {
        studentId: userId,
      },
      include: {
        assignment: true,
      },
    });

    // create a array of objects with all the classroom information and the average grade of all submissions for that classroom
    const grades = enrolledIn?.map((classroom) => {
      // get all the submissions for the current classroom
      const submissions = submission.filter(
        (submission) => submission.assignment.classroomId === classroom.id
      );

      // calculate the grade for the classroom
      const grade = submissions.reduce((acc, cur) => {
        // if the submission is graded, add the grade to the accumulator
        if (cur.grade) {
          acc += cur.grade;
        }
        return acc;
      }, 0);
      // divide the total grade by the number of assignments to get the average
      const averageGrade = grade / submissions.length;

      return {
        ...classroom,
        grade: averageGrade ? averageGrade : -1,
      };
    });

    return grades;
  }),
});
