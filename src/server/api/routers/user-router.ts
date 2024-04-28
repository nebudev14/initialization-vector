import { z } from "zod";
import {
  createTRPCRouter,
  authProcedure,
  teacherProcedure,
  verifiedProcedure
} from "~/server/api/trpc";

/* Handles mutations and queries for student data */

export const userRouter = createTRPCRouter({
  getUser: authProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } })
  }),

  getUsers: teacherProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.user.findMany({
      include: {
        challenges: {
          include: {
            challenge: true
          }
        }
      }
    })
  }),

  getUserChallenges: verifiedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.userChallenge.findMany({
      where: { userId: ctx.session.user.id },
      include: {
        challenge: true
      }
    })
  }),

  verifyUser: teacherProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: input.uid },
        data: {
          verified: true,
          challenges: {
            createMany: {
              data: (await ctx.prisma.challenge.findMany()).map((challenge) => {
                return {
                  challengeId: challenge.id,
                  status: "UNCOMPLETE"
                }
              })
            }
          }
        }
      })
    }),

  unverifyUser: teacherProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.user.update({
        where: { id: input.uid },
        data: {
          verified: false,
          challenges: {
            deleteMany: {}
          }
        }
      })
    })
})