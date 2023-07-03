import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { getSession } from "next-auth/react";
import { Tab } from "@headlessui/react";

export default function AdminPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const tabs = ["Create", "Students"];

  console.log(props.students);

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
              <div className="rounded-2xl bg-zinc-800 px-8 py-4">
                <h1 className="mb-8 border-b border-zinc-400 px-1 py-4 text-3xl font-bold ">
                  Create an assignment
                </h1>
                <input
                  className="mb-6 w-full rounded-xl bg-zinc-700 px-4 py-3 text-xl text-zinc-200 outline-none"
                  autoComplete="off"
                  placeholder="Lab Name"
                />
                <textarea
                  className="mb-6 w-full rounded-xl bg-zinc-700 px-4 py-3 text-xl text-zinc-200 outline-none"
                  rows={5}
                  autoComplete="off"
                  placeholder="Description..."
                />
                <input
                  className="mb-6 w-full rounded-xl bg-zinc-700 px-3 py-2 text-lg text-zinc-200 outline-none"
                  autoComplete="off"
                  placeholder="GitHub ipynb URL"
                />
                <input
                  className="mb-6 w-full rounded-xl bg-zinc-700 px-3 py-2 text-lg text-zinc-200 outline-none"
                  autoComplete="off"
                  placeholder="Flag"
                />
                <button className="mb-2 rounded-xl py-2 px-3 bg-yellow-300 text-black font-semibold">Create</button>
              </div>
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
