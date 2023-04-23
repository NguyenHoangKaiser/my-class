import { Skeleton, Space } from "antd";
import classNames from "classnames";
import type { HTMLAttributes, ReactNode } from "react";

function MainHeading({
  title,
  subTitle,
  children,
  titleStyle,
  loading = false,
}: {
  title: string;
  subTitle?: string;
  children?: ReactNode;
  titleStyle?: HTMLAttributes<HTMLHeadingElement>["className"];
  loading?: boolean;
}) {
  return (
    <>
      {loading ? (
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "2rem",
          }}
        >
          <Skeleton.Input
            size="large"
            style={{
              width: "140%",
            }}
            active
          />
          <Skeleton.Button size="large" active />
        </Space>
      ) : (
        <section className="mb-8 flex flex-col gap-8 pl-5 pr-9 md:flex-row md:items-end md:justify-between">
          <div className="flex-col">
            <h1 className={classNames("mt-8 text-4xl md:ml-10", titleStyle)}>
              {title}
            </h1>
            {subTitle && <h2 className="mt-4 text-2xl">{subTitle}</h2>}
          </div>
          {children}
        </section>
      )}
      <hr className="mb-8 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
    </>
  );
}

export default MainHeading;
