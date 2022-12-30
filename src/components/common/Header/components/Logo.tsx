import Link from "next/link";
import React from "react";
import { useSession } from "src/hooks/useSession";

const Logo = () => {
  const session = useSession();

  return (
    <Link
      href={
        session.data
          ? //@ts-expect-error Fix later
            session.data?.user?.role === "teacher"
            ? "/classrooms"
            : "/dashboard"
          : "/"
      }
    >
      WDJ Classroom
    </Link>
  );
};

export default Logo;
