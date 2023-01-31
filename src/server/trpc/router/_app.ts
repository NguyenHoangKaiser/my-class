import { router } from "../trpc";
import { authRouter } from "./auth";
import { classroomRouter } from "./classroomRouter";
import { studentRouter } from "./studentRouter";
import { userRouter } from "./userRouter";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  student: studentRouter,
  classroom: classroomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
