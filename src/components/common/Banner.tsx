import React from "react";
import fallback from "src/assets/student.jpeg";
import type { ImageWithFallbackProps } from "./ImageWithFallback";
import ImageWithFallback from "./ImageWithFallback";
import { supabase } from "src/libs/supabaseClient";

type BannerProps = Omit<ImageWithFallbackProps, "fallbackSrc" | "src"> & {
  classroomId: string;
};

const Banner = (props: BannerProps) => {
  const { classroomId, ...rest } = props;
  const classAvatar = React.useMemo(() => {
    return supabase.storage
      .from("files")
      .getPublicUrl(`avatars/classroom/${classroomId}`);
  }, [classroomId]);

  return (
    <>
      {classAvatar.data.publicUrl && (
        <ImageWithFallback
          {...rest}
          src={classAvatar.data.publicUrl}
          fallbackSrc={fallback}
        />
      )}
    </>
  );
};

function areEqual(prevProps: BannerProps, nextProps: BannerProps) {
  return prevProps.classroomId === nextProps.classroomId;
}

export default React.memo(Banner, areEqual);
