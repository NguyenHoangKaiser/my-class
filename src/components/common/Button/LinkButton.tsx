import type { ReactNode } from "react";
import React from "react";
import classNames from "classnames";

export enum LinkButtonVariant {
  Primary,
  Danger,
  Secondary,
}

function LinkButton({
  children,
  onClick,
  variant = LinkButtonVariant.Primary,
  className,
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: LinkButtonVariant;
  className?: string;
}) {
  const colors = {
    [LinkButtonVariant.Primary]:
      "text-sm text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600 px-4 py-2 flex items-center gap-2",
    [LinkButtonVariant.Danger]:
      "text-sm text-danger transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700 px-4 py-2 flex items-center gap-2",
    [LinkButtonVariant.Secondary]:
      "text-sm text-gray-700 px-4 py-2 hover:text-gray-800 flex items-center gap-2",
  };
  return (
    <button
      onClick={onClick}
      className={classNames(colors[variant], className)}
    >
      {children}
    </button>
  );
}

LinkButton.displayName = "LinkButton";

export default LinkButton;
