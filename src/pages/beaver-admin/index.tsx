import { Tab } from "@headlessui/react";
import { api } from "~/utils/api";
import Image from "next/image";
import { BiArrowBack } from "react-icons/bi";

export default function AdminPage() {
  const tabs = ["Create", "Members"];

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
      <Tab.Group>
        <Tab.List className="grid grid-cols-2 mt-10 mb-16 px-96">
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
                <div className="px-8 py-4 rounded-2xl bg-zinc-800">
                  <h1 className="px-1 py-4 mb-8 text-3xl font-bold border-b border-zinc-400 ">
                    Create an assignment
                  </h1>
                  <input
                    className="w-full px-4 py-3 mb-6 text-xl outline-none rounded-xl bg-zinc-700 text-zinc-200"
                    autoComplete="off"
                    placeholder="Lab Name"
                    id="labName"
                    required
                  />
                  <textarea
                    className="w-full px-4 py-3 mb-6 text-xl outline-none rounded-xl bg-zinc-700 text-zinc-200"
                    rows={5}
                    autoComplete="off"
                    placeholder="Description..."
                    id="desc"
                  />
                  <input
                    className="w-full px-3 py-2 mb-6 text-lg outline-none rounded-xl bg-zinc-700 text-zinc-200"
                    autoComplete="off"
                    placeholder="Flag"
                    id="flag"
                    required
                  />
                  <button className="px-3 py-2 mb-2 font-semibold text-black bg-yellow-300 rounded-xl">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="flex flex-col px-32 py-8">
              {members?.map((member, i) => (
                <div
                  key={i}
                  className="flex items-center justify-start px-6 py-6 border-b-2 border-zinc-600"
                >
                  <Image
                    src={member?.image as string}
                    alt={member?.name as string}
                    width={45}
                    height={45}
                    className="rounded-full"
                  />
                  <h1 className="ml-8 text-2xl font-semibold font-inter">
                    {member.name}
                  </h1>
                  <h1 className="ml-10 text-lg font-inter">{member.email}</h1>
                  <h1 className="ml-10 mr-auto text-lg text-center">
                    {member.userType === "TEACHER" || member.verified
                      ? member.userType
                      : "UNVERIFIED"}
                  </h1>
                  {member.userType === "STUDENT" ? (
                    member.verified ? (
                      <button
                        className="px-6 py-2 text-lg duration-200 bg-red-600 rounded-lg hover:bg-red-500"
                        onClick={async () => {
                          await unverifyMember.mutateAsync({
                            uid: member.id,
                          });
                        }}
                      >
                        Unverify
                      </button>
                    ) : (
                      <button
                        className="px-6 py-2 text-lg duration-200 bg-green-600 rounded-lg hover:bg-green-500"
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
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
