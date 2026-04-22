"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import Image from "next/image";
import { getStableMarketingFallback } from "@/lib/marketing-images";
import { cn } from "@/lib/utils";

type ManagedImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  style?: CSSProperties;
  fallbackSrc?: string;
};

function canUseNextImage(src: string) {
  return src.startsWith("/") || src.startsWith("data:") || src.startsWith("blob:");
}

function resolveFallbackImage(src: string | null | undefined, alt: string, fallbackSrc?: string): string {
  return fallbackSrc || getStableMarketingFallback(`${src || ""}:${alt}`);
}

export function ManagedImage({
  src,
  alt,
  className,
  fill,
  priority,
  style,
  fallbackSrc,
  ...props
}: ManagedImageProps) {
  const fallbackImage = resolveFallbackImage(src, alt, fallbackSrc);
  const resolvedSrc = src || fallbackImage;

  return <ManagedImageInner key={`${src || ""}:${fallbackImage}`} src={resolvedSrc} alt={alt} className={className} fill={fill} priority={priority} style={style} fallbackImage={fallbackImage} {...props} />;
}

type ManagedImageInnerProps = Omit<ManagedImageProps, "fallbackSrc"> & {
  src: string;
  fallbackImage: string;
};

function ManagedImageInner({
  src,
  alt,
  className,
  fill,
  priority,
  style,
  fallbackImage,
  ...props
}: ManagedImageInnerProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src);

  if (canUseNextImage(currentSrc)) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        fill={fill}
        priority={priority}
        style={style}
        className={className}
        unoptimized={currentSrc.startsWith("data:") || currentSrc.startsWith("blob:")}
        onError={() => {
          if (currentSrc !== fallbackImage) {
            setCurrentSrc(fallbackImage);
          }
        }}
        {...props}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      style={style}
      className={cn(fill && "absolute inset-0 h-full w-full", className)}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => {
        if (currentSrc !== fallbackImage) {
          setCurrentSrc(fallbackImage);
        }
      }}
    />
  );
}
