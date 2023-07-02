import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { getSession } from "next-auth/react";

export default function AdminPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {

  console.log(props.students)

  return (
    <div className="min-h-screen px-8 py-6">
      <h1>yeah</h1>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: await createInnerTRPCContext({
      session: await getSession(context),
    }),
  });

  let students = await ssg.teacher.getStudents.fetch();

  return {
    props: {
      students: students,
    },
  };
}
