import type { ReactNode } from "react";

function MainHeading({
  title,
  subTitle,
  children,
}: {
  title: string;
  subTitle?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <section className="mb-8 flex items-end justify-between gap-8 px-5">
        <div className="flex-col">
          <h1 className="mt-8 ml-10 text-4xl">{title}</h1>
          {subTitle && <h2 className="mt-4 text-2xl">{subTitle}</h2>}
        </div>

        {children}
      </section>
      <hr className="mb-8 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:opacity-100" />
    </>
  );
}

export default MainHeading;
