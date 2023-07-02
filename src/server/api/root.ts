import { createTRPCRouter } from "~/server/api/trpc";
import { challengeRouter } from "./routers/challenge-router";
import { teacherRouter } from "./routers/teacher-router";

export const appRouter = createTRPCRouter({
  challenges: challengeRouter,
  teacher: teacherRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
