import type { ReactNode } from "react";

export enum BadgeVariant {
  Error,
  Success,
}

function Badge({
  children,
  variant,
  className,
}: {
  children: ReactNode;
  variant: BadgeVariant;
  className?: string;
}) {
  const colorMap = {
    [BadgeVariant.Error]:
      "bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900",
    [BadgeVariant.Success]:
      "bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900",
  };

  const colors = colorMap[variant];

  return (
    <span
      className={`text-md mr-2 rounded px-2.5 py-0.5 font-semibold ${colors} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
