import type { ReactHTML, ReactNode } from "react";
import React from "react";
import Spinner from "../Icons/Spinner";

export enum Variant {
  Primary,
  Secondary,
  Danger,
}

export const Button = React.forwardRef(
  ({
    children,
    isLoading = false,
    variant = Variant.Primary,
    as = "button",
    className,
    ...rest
  }: {
    children: ReactNode;
    isLoading?: boolean;
    variant: Variant;
    className?: string;
    as?: keyof ReactHTML;
    [key: string]: unknown;
  }) =>
    // ref
    {
      const colors = {
        [Variant.Primary]:
          "bg-blue-50 text-black px-4 py-2 rounded hover:bg-blue-100",
        [Variant.Secondary]:
          "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400",
        [Variant.Danger]:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-400",
      };
      const As = as;
      return (
        <As
          className={`${colors[variant]} ${className} flex items-center gap-2`}
          {...rest}
        >
          {isLoading && <Spinner />}
          {children}
        </As>
      );
    }
);

Button.displayName = "Button";
