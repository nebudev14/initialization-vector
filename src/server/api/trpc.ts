import { UserType } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { z, ZodError } from "zod";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

type CreateContextOptions = {
  session: Session | null;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  // Get the session from the server using the getServerSession wrapper function
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const entityId = z.object({
  entityId: z.string().cuid().optional(),
});

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

// Check if request is by a teacher
export const isTeacher = t.middleware(async ({ ctx, next }) => {

  const fetchedUser = await ctx.prisma.user.findUnique({
    where: { id: ctx.session?.user.id as string }
  });

  if (!fetchedUser || fetchedUser.userType !== UserType.TEACHER) {
    throw new TRPCError({
      message: "You are not a teacher",
      code: "FORBIDDEN"
    });
  }

  return next({ ctx: { result: fetchedUser } });

})

export const authProcedure = t.procedure.use(enforceUserIsAuthed);
export const teacherProcedure = authProcedure.use(isTeacher);
