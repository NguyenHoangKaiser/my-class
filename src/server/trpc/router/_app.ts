import { assignmentRouter } from "./assignmentRouter";
import { submissionRouter } from "./submissionRouter";
import { router } from "../trpc";
import { authRouter } from "./auth";
import { classroomRouter } from "./classroomRouter";
import { studentRouter } from "./studentRouter";
import { userRouter } from "./userRouter";
import { commentRouter } from "./commentRouter";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  student: studentRouter,
  classroom: classroomRouter,
  submission: submissionRouter,
  assignment: assignmentRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
