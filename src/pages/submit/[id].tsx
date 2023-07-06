import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { api } from "~/utils/api";

export default function SubmitChallenge() {
  const router = useRouter();

  return <div></div>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  const id = context.params?.id as string;
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: session,
    })
  });



  if (!session?.user) {
    return {
      props: {},
    };
  }

  

}
