import type { ReactNode } from "react";
import React from "react";
import Spinner from "../Icons/Spinner";

export enum Variant {
  Primary,
  Secondary,
  Danger,
}

function Button({
  children,
  isLoading = false,
  variant = Variant.Primary,
  className,
  ...rest
}: {
  children: ReactNode;
  isLoading?: boolean;
  variant?: Variant;
  className?: string;
  [key: string]: unknown;
}) {
  const colors = {
    [Variant.Primary]: "bg-blue-50 text-black hover:bg-blue-100",
    [Variant.Secondary]: "bg-gray-500 text-white hover:bg-gray-400",
    [Variant.Danger]: "bg-red-500 text-white hover:bg-red-400",
  };
  return (
    <button
      className={`${colors[variant]} ${className} flex items-center gap-2 rounded px-4 py-2`}
      {...rest}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}

export default Button;
