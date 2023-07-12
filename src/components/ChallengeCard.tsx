import { Challenge, ChallengeStatus, UserChallenge } from "@prisma/client";
import Link from "next/link";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { BsPeopleFill } from "react-icons/bs";
import { useRouter } from "next/router";

export const ChallengeCard: React.FC<{
  challenge: Challenge;
  isTeacher: boolean;
  status?: ChallengeStatus;
  students?: UserChallenge[];
}> = ({ challenge, isTeacher, status, students }) => {
  const router = useRouter();
  return (
    <div
      className={`my-8 w-full px-1 ${
        isTeacher ? "hover:cursor-pointer" : null
      }`}
      onClick={
        isTeacher
          ? async () => await router.push(`/beaver-admin/lab/${challenge.id}`)
          : () => {}
      }
    >
      <article className="h-full border shadow-xl rounded-t-2xl border-zinc-800">
        <div className="h-full px-4 py-6 pb-12 border-b border-yellow-300 bg-slate-900">
          <h1 className="block w-full h-auto mb-4 text-3xl font-semibold font-inte">
            {challenge.name}
          </h1>
          <p>{challenge.desc}</p>
        </div>

        <header className="flex items-center justify-between p-2 leading-tight rounded-b-2xl bg-zinc-800 md:p-4">
          <div className="no-underline">
            {isTeacher ? (
              <>
                <div className="flex items-center text-xl">
                  <BsPeopleFill size={30} className="mr-3 text-yellow-400" />
                  {
                    students?.filter(
                      (student) => student.status === "COMPLETED"
                    ).length
                  }
                  /{students?.length} completed
                </div>
              </>
            ) : (
              <>
                {" "}
                {status === "COMPLETED" ? (
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
              </>
            )}
          </div>
        </header>
      </article>
    </div>
  );
};
