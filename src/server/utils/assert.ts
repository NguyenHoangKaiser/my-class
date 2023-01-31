import { TRPCError } from "@trpc/server";
import type { Context } from "../trpc/context";
import Roles from "src/utils/constants";

export const assertIsAssignmentAdmin = async (
  ctx: Context,
  assignmentId: string
) => {
  const assignment = await ctx.prisma.assignment.findUnique({
    where: {
      id: assignmentId,
    },
    include: {
      classroom: true,
    },
  });

  if (
    !assignment ||
    ctx.session?.user === undefined ||
    ctx.session?.user.id !== assignment.classroom.userId
  ) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
};

export const assertIsClassroomAdmin = async (
  ctx: Context,
  classroomId: string
) => {
  const classroom = await ctx.prisma.classroom.findUnique({
    where: {
      id: classroomId,
    },
  });

  if (
    !classroom ||
    ctx.session?.user === undefined ||
    ctx.session?.user.id !== classroom.userId
  ) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
};

export const assertIsStudent = (ctx: Context) => {
  if (
    ctx.session === null ||
    ctx.session.user === undefined ||
    ctx.session.user.role !== Roles.Student
  ) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
};

export const assertIsTeacher = (ctx: Context) => {
  if (
    ctx.session === null ||
    ctx.session.user === undefined ||
    ctx.session.user.role !== Roles.Teacher
  ) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
};