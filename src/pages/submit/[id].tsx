import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { api } from "~/utils/api";

export default function SubmitChallenge(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const router = useRouter();
  const id = router.query.id as string;

  const acceptSubmission = api.challenges.acceptSubmission.useMutation({
    onSuccess() {
      router.push("/");
    },
  });
  if (!props.user) signIn();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-10 text-4xl font-semibold ">
        {props.challenge?.Challenge?.name}
      </h1>
      <button
        onClick={async () => {
          await acceptSubmission.mutateAsync({
            submissionId: id,
          });
        }}
        className="rounded-lg border border-yellow-400 px-3 py-3  text-xl duration-200 hover:bg-yellow-500"
      >
        Submit lab?
      </button>
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

  const challenge = await ssg.challenges.getChallengeBySubmission.fetch({
    subId: context.params?.id as string,
  });


  return {
    props: {
      user: session?.user,
      challenge: challenge,
    },
  };
}
