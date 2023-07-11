import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import { UnsignedHome } from "~/components/UnsignedHome";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChallengeCard } from "~/components/ChallengeCard";

export default function Home(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { user, userChallenges, challenges } = props;
  const router = useRouter();

  const isTeacher = user?.userType === "TEACHER";

  console.log(userChallenges)

  return (
    <>
      {!props.user ? (
        <UnsignedHome />
      ) : (
        <div>
          {user?.verified || isTeacher ? (
            <>
              <div className="flex min-h-screen">
              <div className="container w-4/6 px-4 my-12">
                  <h1 className="pl-12 text-5xl font-bold">
                    <span className="text-yellow-300">I</span>nitialization{" "}
                    <span className="text-yellow-300">V</span>ector
                  </h1>
                  <div className="px-8 py-6 md:px-12">
                    <div className="grid grid-cols-2 gap-12 -mx-1 lg:-mx-4 ">
                      {isTeacher ? (
                        <>
                          {challenges?.map((challenge, i) => (
                            <ChallengeCard
                              challenge={challenge}
                              isTeacher={isTeacher}
                              students={challenge.users}
                              key={i}
                            />
                          ))}
                        </>
                      ) : (
                        <>
                          {userChallenges?.map((userChallenge, i) => (
                            <ChallengeCard
                              challenge={userChallenge.challenge}
                              isTeacher={isTeacher}
                              status={userChallenge.status}
                              key={i}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="fixed right-0 flex flex-col items-center w-1/6 h-screen bg-zinc-800 ">
                  <div className="flex items-center justify-center px-4 py-12 mb-12">
                    <Image
                      src={user.image as string}
                      alt={user.name as string}
                      width={45}
                      height={45}
                      className="rounded-full "
                    />
                    <h1 className="ml-4 text-xl">{user.name}</h1>
                  </div>
                  <div className="mb-auto">
                    {user.userType === "STUDENT" ? (
                      <h1 className="text-lg text-gray-400">Coming soon..</h1>
                    ) : null}
                  </div>
                  {user.userType === "TEACHER" ? (
                    <div
                      onClick={async () => await router.push("/beaver-admin")}
                      className="w-full py-3 text-center duration-200 bg-yellow-500 hover:cursor-pointer hover:bg-yellow-600"
                    >
                      <h1 className="text-xl text-gray-100">Admin Portal</h1>
                    </div>
                  ) : null}
                  <div
                    onClick={async () => await signOut()}
                    className="w-full py-3 text-center duration-200 bg-red-500 hover:cursor-pointer hover:bg-red-600"
                  >
                    <h1 className="text-xl text-gray-100">Sign Out</h1>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-2xl">
                You are not a verified student! Please contact the instructors
                on Discord to be verified.
              </h1>
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

  const user = await ssg.user.getUser.fetch();
  const userChallenges = await ssg.user.getUserChallenges.fetch();
  const challenges = await ssg.challenges.getAll.fetch();

  return {
    props: {
      user: user,
      userChallenges: userChallenges,
      challenges: challenges,
    },
  };
}
