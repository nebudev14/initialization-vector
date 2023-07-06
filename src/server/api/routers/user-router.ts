import { z } from "zod";
import {
  createTRPCRouter,
  authProcedure,
  teacherProcedure
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUser: authProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({ where: { id: ctx.session.user.id } })
  }),

  getUsers: teacherProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      include: {
        challenges: {
          include: {
            challenge: true
          }
        }
      }
    })
  }),

  verifyUser: teacherProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
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
      return ctx.prisma.user.update({
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