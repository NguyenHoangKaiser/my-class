import type { ReactNode } from "react";
import { isEmpty } from "lodash";
import { Spin } from "antd";

function EmptyStateWrapper({
  isLoading,
  data,
  EmptyComponent,
  NonEmptyComponent,
}: {
  isLoading?: boolean;
  data: unknown;
  EmptyComponent: ReactNode;
  NonEmptyComponent: ReactNode;
}) {
  return (
    <>
      {isLoading ? (
        <div className="mx-auto px-6 py-4 text-center">
          <Spin spinning />
        </div>
      ) : isEmpty(data) ? (
        EmptyComponent
      ) : (
        NonEmptyComponent
      )}
    </>
  );
}

export default EmptyStateWrapper;
