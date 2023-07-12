import { z } from "zod";
import { createTRPCRouter, teacherProcedure } from "~/server/api/trpc";
import { AES } from "crypto-ts";

export const teacherRouter = createTRPCRouter({
  createChallenge: teacherProcedure
    .input(
      z.object({
        name: z.string(),
        desc: z.string(),
        flag: z.string(),
        url: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const challenge = await ctx.prisma.challenge.create({
        data: {
          name: input.name,
          desc: input.desc,
          flag: AES.encrypt(
            input.flag,
            process.env.AES_KEY as string
          ).toString(),
          url: input.url,
          users: {
            createMany: {
              data: (
                await ctx.prisma.user.findMany()
              )
                .filter((user) => user.userType === "STUDENT" && user.verified)
                .map((user) => {
                  return {
                    status: "UNCOMPLETE",
                    userId: user.id as string,
                  };
                }),
            },
          },
        },
      });

      return challenge;
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

  /* Gets student progress for each lab */
  getStudentLabs: teacherProcedure
    .input(z.object({ studentId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.userChallenge.findMany({
        where: { userId: input.studentId },
        include: {
          user: true,
          challenge: true,
        },
      });
    }),

  getLabStatus: teacherProcedure
  .input(z.object({ labId: z.string() }))
  .query(async ({ ctx, input }) => {
    return await ctx.prisma.challenge.findUnique({
      where: { id: input.labId },
      include: {
        users: true
      }
    })
  })
});
