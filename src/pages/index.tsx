import { createServerSideHelpers } from "@trpc/react-query/server";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getSession, useSession } from "next-auth/react";
import { UnsignedHome } from "~/components/UnsignedHome";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {

  const { user, challenges } = props;

  return (
    <>
      {!props.user ? (
        <UnsignedHome />
      ) : (
        <div>
          {user?.verified ? (
            <div className="min-h-screen px-8 py-6">
              <div className="container mx-auto my-12 px-4 md:px-12 ">
                <div className="-mx-1 flex flex-wrap lg:-mx-4 ">
                  {challenges?.map((challenge, i) => (
                    <div
                      key={i}
                      className="my-1 w-full px-1 md:w-1/2 lg:my-4 lg:w-1/3 lg:px-4"
                    >
                      <article className="overflow-hidden rounded-2xl border border-zinc-800 shadow-xl ">
                        <h1 className="font-inte block h-auto w-full border-b border-yellow-300 bg-slate-900 px-4 py-6 pb-36 text-3xl font-semibold">
                          {challenge.name}
                        </h1>

                        <header className="flex items-center justify-between bg-zinc-800 p-2 leading-tight md:p-4">
                          <h1 className="text-lg">
                            <p className="no-underline hover:underline">
                              {challenge.desc}
                            </p>
                          </h1>
                        </header>
                      </article>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-2xl">You are not a verified student! Please contact the instructors on Discord to be verified.</h1>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  if (!session?.user) {
    return {
      props: {},
    };
  }

  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: session,
    }),
  });

  let user = await ssg.user.getUser.fetch();
  let challenges = await ssg.challenges.getAll.fetch();

  return {
    props: {
      user: user,
      challenges: challenges,
    },
  };
}
