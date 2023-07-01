import { signIn } from "next-auth/react";

export const UnsignedHome: React.FC = () => {
  return (
    <div className=" flex min-h-screen flex-col items-center justify-center font-inter">
      <h1 className="mb-10  text-8xl font-bold">
        <span className="text-yellow-300">I</span>nitialization{" "}
        <span className="text-yellow-300">V</span>ector
      </h1>
      <h1 className="mb-2 text-3xl font-bold">
        BWSI <span className="text-yellow-300">Embedded</span> Security and
        <span className="text-yellow-300"> Hardware</span> Hacking
      </h1>
      <p className="mb-12 text-center text-xl text-zinc-400">
        A semi-interactive website for the course (that has nothing to do with
        initialization vectors)
      </p>
      <button
        className="rounded-lg border-2 border-yellow-400 px-6 py-3 text-2xl font-semibold"
        onClick={() => signIn()}
      >
        Sign In
      </button>
    </div>
  );
};
