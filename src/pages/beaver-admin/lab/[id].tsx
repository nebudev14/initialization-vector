import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";
import { BsPeopleFill } from "react-icons/bs";
import Image from "next/image";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { ChallengeStatus } from "@prisma/client";

export default function LabPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { lab } = props;
  const router = useRouter();

  const order = Object.values(ChallengeStatus);
  const sortedUsers = lab?.users.sort(
    (a, b) => order.indexOf(a.status) - order.indexOf(b.status)
  );

  return (
    <div className="min-h-screen">
      {!props.user ? (
        <div className="flex items-center justify-center">
          <h1 className="text-2xl">sign in bro</h1>
        </div>
      ) : (
        <div className="container px-4 pl-16 my-12 ">
          <BiArrowBack
            size={30}
            className="mb-6 duration-150 hover:cursor-pointer hover:text-yellow-400"
            onClick={async () => await router.push("/")}
          />
          <h1 className="mb-2 text-5xl font-bold">{lab?.name}</h1>
          <div className="flex items-center mb-12 text-xl">
            <BsPeopleFill size={30} className="mr-3 text-yellow-400" />
            {
              lab?.users?.filter((student) => student.status === "COMPLETED")
                .length
            }
            /{lab?.users?.length} completed
          </div>
          <div className="flex flex-col items-center justify-center">
            {sortedUsers?.map((student, i) => (
              <div
                key={i}
                onClick={async () =>
                  await router.push(`/beaver-admin/user/${student.userId}`)
                }
                className="w-full px-4 py-4 my-2 duration-200 border-b border-b-zinc-700 hover:cursor-pointer hover:border-b-yellow-400"
              >
                <div className="flex items-center">
                  <Image
                    src={student.user?.image as string}
                    alt={student.user?.name as string}
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                  <h1 className="ml-8 text-2xl font-semibold font-inter">
                    {student.user.name}
                  </h1>
                  <h1 className="ml-10 mr-auto text-lg font-inter">
                    {student.user.email}
                  </h1>
                  {student.status === "COMPLETED" ? (
                    <div className="flex items-center">
                      <AiOutlineCheckCircle
                        size={25}
                        className="inline-block mr-3 text-green-400"
                      />
                      <h1 className="text-lg">Completed</h1>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <ImCross
                        size={20}
                        className="inline-block mr-3 text-red-500"
                      />
                      <h1 className="text-lg">Incomplete</h1>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
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

  const labId = context.query?.id as string;
  const lab = await ssg.teacher.getLabStatus.fetch({ labId: labId });

  return {
    props: {
      user: session.user,
      lab: lab,
    },
  };
}
