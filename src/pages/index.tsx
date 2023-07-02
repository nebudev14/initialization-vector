import { useSession } from "next-auth/react";
import { UnsignedHome } from "~/components/UnsignedHome";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      {!session?.user.id ? (
        <UnsignedHome />
      ) : (
        <div className="min-h-screen px-8 py-6">
          <div className="container px-4 mx-auto my-12 md:px-12 ">
            <div className="flex flex-wrap -mx-1 lg:-mx-4 ">
              <div className="w-full px-1 my-1 md:w-1/2 lg:my-4 lg:w-1/3 lg:px-4">
                <article className="overflow-hidden border shadow-xl rounded-2xl border-zinc-800 ">
                  <h1 className="block w-full h-auto px-4 py-6 text-3xl font-semibold border-b border-yellow-300 bg-slate-900 font-inte pb-36">
                    AES Python
                  </h1>

                  <header className="flex items-center justify-between p-2 leading-tight md:p-4 bg-zinc-800">
                    <h1 className="text-lg">
                      <a className="no-underline hover:underline" href="#">
                        Article Title
                      </a>
                    </h1>
                  </header>


                </article>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
