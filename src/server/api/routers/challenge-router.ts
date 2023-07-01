import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  authProcedure,
  teacherProcedure,
} from "~/server/api/trpc";

export const challengeRouter = createTRPCRouter({
  getAll: authProcedure.query(async ({ ctx }) => {
    return ctx.prisma.challenge.findMany();
  }),

  updateStatus: authProcedure
    .input(z.object({ challengeId: z.string(), flag: z.string() }))
    .query(async ({ ctx, input }) => {
      const challenge = await ctx.prisma.challenge.findUnique({
        where: { id: input.challengeId },
      });

      if (challenge?.flag !== input.flag) {
        throw new TRPCError({
          message: "Invalid Flag",
          code: "FORBIDDEN",
        });
      }

      return challenge;
    }),
});
