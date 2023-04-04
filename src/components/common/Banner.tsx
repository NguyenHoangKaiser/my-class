import React from "react";
import fallback from "src/assets/student.jpeg";
import ImageWithFallback from "./ImageWithFallback";
import { supabase } from "src/libs/supabaseClient";
import type { ImageProps } from "next/image";

interface BannerProps {
  classroomId: string;
  height: ImageProps["height"];
  width: ImageProps["width"];
  alt: ImageProps["alt"];
}

const Banner = (props: BannerProps) => {
  const { classroomId, ...rest } = props;
  const classAvatar = React.useMemo(() => {
    return supabase.storage
      .from("files")
      .getPublicUrl(`avatars/classroom/${classroomId}`);
  }, [classroomId]);
  console.log(classAvatar);

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

export default Banner;
