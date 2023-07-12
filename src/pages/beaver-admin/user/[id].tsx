import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";

export default function UserPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { student } = props;
  const router = useRouter();

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
            onClick={async () => await router.back()}
          />
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
  const student = await ssg.teacher.getStudentLabs.fetch({
    studentId: studentId,
  });

  return {
    props: {
      user: session.user,
      student: student,
    },
  };
}
