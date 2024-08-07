import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";
import Image from "next/image";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { ChallengeStatus } from "@prisma/client";
import { useEffect } from "react";

export default function UserPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { studentLabs } = props;
  const student = studentLabs?.[0]?.user;
  const router = useRouter();

  const order = Object.values(ChallengeStatus);
  const sortedLabs = studentLabs?.sort(
    (a, b) => order.indexOf(b.status) - order.indexOf(a.status)
  );

  useEffect(() => {
    if (student?.userType === "TEACHER") router.push("/beaver-admin");
  });

  return (
    <div className="min-h-screen">
      {!props.user ? (
        <div className="flex items-center justify-center">
          <h1 className="text-2xl">sign in bro</h1>
        </div>
      ) : (
        <div className="container my-12 px-4 pl-16 ">
          <BiArrowBack
            size={30}
            className="mb-6 duration-150 hover:cursor-pointer hover:text-yellow-400"
            onClick={async () => await router.back()}
          />
          <div className="mb-12 flex items-center">
            <Image
              src={student?.image as string}
              alt={student?.name as string}
              width={75}
              height={75}
              className="mr-6 rounded-full"
            />
            <h1 className="text-5xl font-bold">{student?.name}</h1>
          </div>
          <div className="flex flex-col items-center justify-center">
            {sortedLabs?.map((lab, i) => (
              <div
                key={i}
                onClick={async () =>
                  await router.push(`/beaver-admin/lab/${lab.challengeId}`)
                }
                className="my-2 flex w-full items-center border-b border-b-zinc-700 py-4 duration-200 hover:cursor-pointer hover:border-b-yellow-400"
              >
                <h1 className="ml-8 mr-auto font-inter text-2xl font-semibold">
                  {lab.challenge.name}
                </h1>
                {lab.status === "COMPLETED" ? (
                  <div className="flex items-center">
                    <AiOutlineCheckCircle
                      size={25}
                      className="mr-3 inline-block text-green-400"
                    />
                    <h1 className="text-lg">
                      Submitted at {lab.completedAt?.toLocaleTimeString()},{" "}
                      {lab.completedAt?.toDateString()}
                    </h1>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <ImCross
                      size={20}
                      className="mr-3 inline-block text-red-500"
                    />
                    <h1 className="text-lg">Incomplete</h1>
                  </div>
                )}
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

  const studentId = context.query?.id as string;
  const studentLabs = await ssg.teacher.getStudentLabs.fetch({
    studentId: studentId,
  });

  return {
    props: {
      user: session.user,
      studentLabs: studentLabs,
    },
  };
}
