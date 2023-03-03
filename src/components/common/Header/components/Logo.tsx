import Link from "next/link";
import React from "react";
import { useSession } from "src/hooks";
import { Typography } from "antd";
function Logo() {
  const session = useSession();

  return (
    <Link
      href={
        session.data
          ? session.data?.user?.role === "teacher"
            ? "/classrooms"
            : "/dashboard"
          : "/"
      }
    >
      <Typography.Text>My-Classroom</Typography.Text>
    </Link>
  );
}

export default Logo;
