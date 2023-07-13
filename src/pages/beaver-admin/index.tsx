import { Tab } from "@headlessui/react";
import { api } from "~/utils/api";
import Image from "next/image";
import { BiArrowBack } from "react-icons/bi";
import { useRouter } from "next/router";

export default function AdminPage() {
  const tabs = ["Members", "Create"];
  const router = useRouter();

  const mutateChallenge = api.teacher.createChallenge.useMutation();
  const { data: members } = api.user.getUsers.useQuery();

  const util = api.useContext();

  const verifyMember = api.user.verifyUser.useMutation({
    onSuccess() {
      util.user.invalidate();
    },
  });

  const unverifyMember = api.user.unverifyUser.useMutation({
    onSuccess() {
      util.user.invalidate();
    },
  });

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      labName: { value: string };
      desc: { value: string };
      flag: { value: string };
    };

    await mutateChallenge.mutateAsync({
      name: target.labName.value,
      desc: target.desc.value,
      url: "",
      flag: target.flag.value.replaceAll(" ", ""),
    });

    target.labName.value = "";
    target.desc.value = "";

    target.flag.value = "";
  };

  return (
    <div className="min-h-screen px-8 py-6">
      <BiArrowBack
        size={30}
        className="mb-6 duration-150 hover:cursor-pointer hover:text-yellow-400"
        onClick={async () => await router.push("/")}
      />
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
            <div className="flex flex-col px-32 py-8">
              {members?.map((member, i) => (
                <div
                  key={i}
                  onClick={async () =>
                    await router.push(`/beaver-admin/user/${member.id}`)
                  }
                  className="flex items-center justify-start border-b-2 border-zinc-600 px-6 py-6 duration-200 hover:cursor-pointer hover:border-yellow-400"
                >
                  <Image
                    src={member?.image as string}
                    alt={member?.name as string}
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                  <h1 className="ml-8 font-inter text-2xl font-semibold">
                    {member.name}
                  </h1>
                  <h1 className="ml-10 font-inter text-lg">{member.email}</h1>
                  <h1 className="ml-10 mr-auto text-center text-lg">
                    {member.userType === "TEACHER" || member.verified
                      ? member.userType
                      : "UNVERIFIED"}
                  </h1>
                  {member.userType === "STUDENT" ? (
                    member.verified ? (
                      // <button
                      //   className="px-6 py-2 text-lg duration-200 bg-red-600 rounded-lg hover:bg-red-500"
                      //   onClick={async () => {
                      //     await unverifyMember.mutateAsync({
                      //       uid: member.id,
                      //     });
                      //   }}
                      // >
                      //   Unverify
                      // </button>
                      <> </>
                    ) : (
                      <button
                        className="rounded-lg bg-green-600 px-6 py-2 text-lg duration-200 hover:bg-green-500"
                        onClick={async () => {
                          await verifyMember.mutateAsync({
                            uid: member.id,
                          });
                        }}
                      >
                        Verify
                      </button>
                    )
                  ) : null}
                </div>
              ))}
            </div>
          </Tab.Panel>
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
                    required
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
                    placeholder="Flag"
                    id="flag"
                    required
                  />
                  <button className="mb-2 rounded-xl bg-yellow-300 px-3 py-2 font-semibold text-black">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
