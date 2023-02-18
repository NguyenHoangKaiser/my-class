import type { ReactNode } from "react";
import React from "react";

export enum LinkButtonVariant {
  Primary,
  Danger,
  Secondary,
}

function LinkButton({
  children,
  onClick,
  variant = LinkButtonVariant.Primary,
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: LinkButtonVariant;
}) {
  const colors = {
    [LinkButtonVariant.Primary]:
      "text-sm text-blue-400 px-4 py-2 hover:text-blue-500 flex items-center gap-2",
    [LinkButtonVariant.Danger]:
      "text-sm text-red-400 px-4 py-2 hover:text-red-500 flex items-center gap-2",
    [LinkButtonVariant.Secondary]:
      "text-sm text-gray-700 px-4 py-2 hover:text-gray-800 flex items-center gap-2",
  };
  return (
    <button onClick={onClick} className={colors[variant]}>
      {children}
    </button>
  );
}

LinkButton.displayName = "LinkButton";

export default LinkButton;
