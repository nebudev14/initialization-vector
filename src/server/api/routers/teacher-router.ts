import { z } from "zod";
import { createTRPCRouter, teacherProcedure } from "~/server/api/trpc";
import { AES } from "crypto-ts";

export const teacherRouter = createTRPCRouter({
  createChallenge: teacherProcedure
    .input(z.object({ name: z.string(), desc: z.string(), flag: z.string(), url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.challenge.create({
        data: {
          name: input.name,
          desc: input.desc,
          flag: AES.encrypt(input.flag, process.env.AES_KEY as string).toString(),
          url: input.url,
        },
      });
    }),

  getStudents: teacherProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      where: { userType: "STUDENT" },
      include: {
        challenges: {
          include: { challenge: true },
        },
      },
    });
  }),


});
