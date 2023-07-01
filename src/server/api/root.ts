import { createTRPCRouter } from "~/server/api/trpc";
import { challengeRouter } from "./routers/challenge-router";

export const appRouter = createTRPCRouter({
  challenges: challengeRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;
