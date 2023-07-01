import { useSession } from "next-auth/react";
import { UnsignedHome } from "~/components/UnsignedHome";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      {!session?.user.id ? <UnsignedHome /> : (
        <div>
          hello
        </div>
      )}
    </>
  );
}
