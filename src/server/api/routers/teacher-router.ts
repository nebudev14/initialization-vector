import { z } from "zod";
import { createTRPCRouter, teacherProcedure } from "~/server/api/trpc";

export const teacherRouter = createTRPCRouter({
  createChallenge: teacherProcedure
    .input(z.object({ name: z.string(), flag: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.challenge.create({
        data: {
          name: input.name,
          flag: input.flag,
          url: input.url,
        },
      });
    }),
});
