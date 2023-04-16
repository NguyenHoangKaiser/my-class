import { TRPCError } from "@trpc/server";
import { supabaseDeleteFile } from "src/utils/helper";
import z from "zod";
import { protectedProcedure, router } from "../trpc";
import {
  assertIsClassroomAdmin,
  assertIsStudent,
  assertIsTeacher,
} from "./../../utils/assert";

export const classroomRouter = router({
  getStudents: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const classroom = await ctx.prisma.classroom.findUnique({
        where: {
          id: input.classroomId,
        },
        include: {
          students: {
            include: {
              ratings: true,
            },
          },
        },
      });
      return classroom?.students.map((student) => {
        return {
          ...student,
          ratings: student.ratings.find(
            (rating) => rating.classroomId === input.classroomId
          ),
        };
      });
    }),
  findClassroom: protectedProcedure
    .input(z.object({ name: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      type TLocation = {
        name?: string;
      };
      const location: TLocation = {};
      if (input?.name) {
        location.name = input.name;
      }
      const classrooms = await ctx.prisma.classroom.findMany({
        where: location,
        include: {
          teacher: true,
          subjects: true,
        },
      });
      return classrooms;
    }),
  createClassroom: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        language: z.string(),
        password: z.string().nullable(),
        requirements: z.string(),
        modifier: z.string(),
        subject: z.array(
          z.object({ name: z.string(), description: z.string() })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsTeacher(ctx); // Verify that the user is a teacher
      const classroom = await ctx.prisma.classroom.create({
        include: {
          subjects: true,
        },
        data: {
          userId: ctx.session.user.id as string, // We know that the user is a teacher because of the assertIsTeacher call above
          name: input.name,
          description: input.description,
          language: input.language,
          password: input.password,
          requirements: input.requirements,
          modifier: input.modifier,
          subjects: {
            connectOrCreate: input.subject.map((subject) => ({
              where: {
                name: subject.name,
              },
              create: {
                name: subject.name,
                description: subject.description,
              },
            })),
          },
        },
        // use connectOrCreate to create the subject if it doesn't exist yet, otherwise connect to it
      });
      return classroom;
    }),
  getClassroomsForTeacher: protectedProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        modifier: z.string().optional(),
        language: z.string().optional(),
        count: z.number().optional(),
        subject: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this resource",
        });
      }

      const classrooms = await ctx.prisma.classroom.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          userId: input.userId || userId,
          modifier: input.modifier,
          language: input.language,
          subjects: {
            some: {
              id: input.subject,
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
  getClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const classroom = await ctx.prisma.classroom.findUnique({
        where: {
          id: input.classroomId,
        },
        include: {
          subjects: true,
          students: true,
          assignments: true,
          teacher: true,
          ratings: true,
          _count: true,
        },
      });
      return classroom;
    }),
  editClassroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        name: z.string(),
        description: z.string(),
        language: z.string(),
        password: z.string().nullable(),
        requirements: z.string(),
        modifier: z.string(),
        status: z.string(),
        subject: z.array(
          z.object({ name: z.string(), description: z.string() })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsClassroomAdmin(ctx, input.classroomId);
      const updatedClassroom = await ctx.prisma.classroom.update({
        where: {
          id: input.classroomId,
        },
        include: {
          subjects: true,
        },
        data: {
          name: input.name,
          description: input.description,
          language: input.language,
          password: input.password,
          requirements: input.requirements,
          modifier: input.modifier,
          status: input.status,
          subjects: {
            connectOrCreate: input.subject.map((subject) => ({
              where: {
                name: subject.name,
              },
              create: {
                name: subject.name,
                description: subject.description,
              },
            })),
          },
        },
      });
      return updatedClassroom;
    }),
  createAssignment: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        dueDate: z.string(),
        classroomId: z.string(),
        description: z.string(),
        subject: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsClassroomAdmin(ctx, input.classroomId);
      const assignment = await ctx.prisma.assignment.create({
        data: {
          name: input.name,
          dueDate: input.dueDate,
          classroomId: input.classroomId,
          description: input.description,
          subject: input.subject,
        },
      });
      return assignment;
    }),
  getAssignments: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const assignments = await ctx.prisma.assignment.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          classroomId: input.classroomId,
        },
        include: {
          attachments: true,
          submissions: true,
        },
      });
      return assignments;
    }),
  getAssignment: protectedProcedure
    .input(z.object({ assignmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: {
          id: input.assignmentId,
        },
      });
      return assignment;
    }),
  enrollInClassroom: protectedProcedure
    .input(
      z.object({ classroomId: z.string(), password: z.string().optional() })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsStudent(ctx);
      const userId = ctx.session.user.id as string;
      const classroom = await ctx.prisma.classroom.findUnique({
        where: {
          id: input.classroomId,
        },
      });
      if (!classroom) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Classroom not found",
        });
      }
      if (classroom.password && classroom.password !== input.password) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Incorrect password",
        });
      }
      const user = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          enrolledIn: {
            connect: {
              id: input.classroomId,
            },
          },
        },
      });
      return user;
    }),
  unEnroll: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      assertIsStudent(ctx);
      const userId = ctx.session.user.id as string;
      const classroom = await ctx.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          enrolledIn: {
            disconnect: {
              id: input.classroomId,
            },
          },
        },
      });
      return classroom;
    }),
  deleteClassroom: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      assertIsClassroomAdmin(ctx, input.classroomId);
      const assignments = await ctx.prisma.assignment.findMany({
        where: {
          classroomId: input.classroomId,
        },
        include: {
          submissions: true,
          attachments: true,
        },
      });
      supabaseDeleteFile({ classroomId: input.classroomId });
      for (const assignment of assignments) {
        for (const submission of assignment.submissions) {
          supabaseDeleteFile({
            submissionId: submission.id,
            studentId: submission.studentId,
            filename: submission.filename,
          });
        }
        for (const attachment of assignment.attachments) {
          supabaseDeleteFile({
            attachmentId: attachment.id,
            assignmentId: attachment.assignmentId,
            filename: attachment.filename,
          });
        }
      }
      const classroom = await ctx.prisma.classroom.delete({
        where: {
          id: input.classroomId,
        },
      });
      return classroom;
    }),
  getSubjects: protectedProcedure.query(async ({ ctx }) => {
    const subjects = await ctx.prisma.subject.findMany({
      orderBy: {
        name: "asc",
      },
    });
    return subjects;
  }),
  browseClassroom: protectedProcedure
    .input(
      z.object({
        modifier: z.string().optional(),
        language: z.string().optional(),
        count: z.number().optional(),
        subject: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to access this resource",
        });
      }

      const classrooms = await ctx.prisma.classroom.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          modifier: input.modifier,
          language: input.language,
          subjects: {
            some: {
              id: input.subject,
            },
          },
        },
        include: {
          subjects: true,
          students: true,
          _count: true,
        },
      });
      const classroomsNotEnrolled = classrooms.filter(
        (classroom) =>
          classroom.students.findIndex((student) => student.id === userId) ===
          -1
      );

      return classroomsNotEnrolled;
    }),
  rateClassroom: protectedProcedure
    .input(
      z.object({
        classroomId: z.string(),
        amount: z.number().min(1).max(5),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsStudent(ctx);
      const userId = ctx.session.user.id as string;
      const rating = await ctx.prisma.rating.findFirst({
        where: {
          classroomId: input.classroomId,
          studentId: userId,
        },
      });
      if (rating) {
        const updatedRating = await ctx.prisma.rating.update({
          where: {
            id: rating.id,
          },
          data: {
            amount: input.amount,
            description: input.description,
          },
        });
        return updatedRating;
      }
      const newRating = await ctx.prisma.rating.create({
        data: {
          amount: input.amount,
          description: input.description,
          classroomId: input.classroomId,
          studentId: userId,
        },
      });
      return newRating;
    }),
  getRatings: protectedProcedure
    .input(z.object({ classroomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const ratings = await ctx.prisma.rating.findMany({
        orderBy: {
          createdAt: "asc",
        },
        where: {
          classroomId: input.classroomId,
        },
        include: {
          student: true,
        },
      });
      return ratings;
    }),
  editRating: protectedProcedure
    .input(
      z.object({
        ratingId: z.string(),
        amount: z.number().min(1).max(5),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertIsStudent(ctx);
      const userId = ctx.session.user.id as string;
      const rating = await ctx.prisma.rating.findUnique({
        where: {
          id: input.ratingId,
        },
      });
      if (!rating) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Rating not found",
        });
      }
      if (rating.studentId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You cannot edit this rating",
        });
      }
      const updatedRating = await ctx.prisma.rating.update({
        where: {
          id: input.ratingId,
        },
        data: {
          amount: input.amount,
          description: input.description,
        },
      });
      return updatedRating;
    }),
});
