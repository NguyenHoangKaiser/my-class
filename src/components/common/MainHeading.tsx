import classNames from "classnames";
import type { HTMLAttributes, ReactNode } from "react";

function MainHeading({
  title,
  subTitle,
  children,
  titleStyle,
}: {
  title: string;
  subTitle?: string;
  children?: ReactNode;
  titleStyle?: HTMLAttributes<HTMLHeadingElement>["className"];
}) {
  return (
    <>
      <section className="mb-8 flex flex-col gap-8 px-5 md:flex-row md:items-end md:justify-between">
        <div className="flex-col">
          <h1 className={classNames("mt-8 text-4xl md:ml-10", titleStyle)}>
            {title}
          </h1>
          {subTitle && <h2 className="mt-4 text-2xl">{subTitle}</h2>}
        </div>

        {children}
      </section>
      <hr className="mb-8 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
    </>
  );
}

export default MainHeading;
