import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { getSession } from "next-auth/react";
import { Tab } from "@headlessui/react";
import { api } from "~/utils/api";

export default function AdminPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const tabs = ["Create", "Students"];

  const mutateChallenge = api.teacher.createChallenge.useMutation();

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      labName: { value: string };
      desc: { value: string };
      url: { value: string };
      flag: { value: string };
    };

    await mutateChallenge.mutateAsync({
      name: target.labName.value,
      desc: target.desc.value,
      url: target.url.value,
      flag: target.flag.value,
    });
  };

  return (
    <div className="min-h-screen px-8 py-6">
      <Tab.Group>
        <Tab.List className="mb-16 mt-10 grid grid-cols-2 px-96">
          {tabs.map((tab, i) => (
            <Tab
              key={i}
              className={({ selected }) =>
                selected
                  ? "border-b-2 border-yellow-300 px-6 py-4 outline-none md:px-2 md:text-sm"
                  : "px-6 py-2 md:px-2 md:text-sm "
              }
            >
              <h1 className="text-xl font-semibold">{tab}</h1>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          <Tab.Panel>
            <div className="px-32 py-8 ">
              <form onSubmit={submit}>
                <div className="rounded-2xl bg-zinc-800 px-8 py-4">
                  <h1 className="mb-8 border-b border-zinc-400 px-1 py-4 text-3xl font-bold ">
                    Create an assignment
                  </h1>
                  <input
                    className="mb-6 w-full rounded-xl bg-zinc-700 px-4 py-3 text-xl text-zinc-200 outline-none"
                    autoComplete="off"
                    placeholder="Lab Name"
                    id="labName"
                  />
                  <textarea
                    className="mb-6 w-full rounded-xl bg-zinc-700 px-4 py-3 text-xl text-zinc-200 outline-none"
                    rows={5}
                    autoComplete="off"
                    placeholder="Description..."
                    id="desc"
                  />
                  <input
                    className="mb-6 w-full rounded-xl bg-zinc-700 px-3 py-2 text-lg text-zinc-200 outline-none"
                    autoComplete="off"
                    placeholder="GitHub ipynb URL"
                    id="url"
                  />
                  <input
                    className="mb-6 w-full rounded-xl bg-zinc-700 px-3 py-2 text-lg text-zinc-200 outline-none"
                    autoComplete="off"
                    placeholder="Flag"
                    id="flag"
                  />
                  <button className="mb-2 rounded-xl bg-yellow-300 px-3 py-2 font-semibold text-black">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div>ball 2</div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
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
