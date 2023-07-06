import { createTRPCRouter } from "~/server/api/trpc";
import { challengeRouter } from "./routers/challenge-router";
import { teacherRouter } from "./routers/teacher-router";
import { userRouter } from "./routers/user-router";

export const appRouter = createTRPCRouter({
  user: userRouter,
  challenges: challengeRouter,
  teacher: teacherRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
