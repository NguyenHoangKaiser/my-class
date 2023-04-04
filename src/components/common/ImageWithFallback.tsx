import React, { useState } from "react";
import type { ImageProps } from "next/image";
import Image from "next/image";

export interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc: ImageProps["src"];
}

const ImageWithFallback = (props: ImageWithFallbackProps) => {
  const { src, fallbackSrc, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      {...rest}
      alt={props.alt}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
};

export default ImageWithFallback;
