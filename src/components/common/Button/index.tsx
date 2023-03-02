import type { ReactNode } from "react";
import React from "react";
import Spinner from "../Icons/Spinner";

export enum Variant {
  Primary,
  Secondary,
  Danger,
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: Variant;
  className?: string;
}

function Button({
  children,
  isLoading = false,
  variant = Variant.Primary,
  className,
  ...rest
}: ButtonProps) {
  const colors = {
    [Variant.Primary]:
      "inline-block rounded bg-primary px-6 py-2 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]",
    [Variant.Secondary]:
      "inline-block rounded bg-primary-100 px-6 py-2 font-medium  leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200",
    [Variant.Danger]:
      "inline-block rounded bg-danger px-6 py-2 font-medium leading-normal text-white shadow-[0_4px_9px_-4px_#dc4c64] transition duration-150 ease-in-out hover:bg-danger-600 hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:bg-danger-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-danger-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)]",
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
