"use client";

/**
 * 마당 사진 하나를 보여 줍니다.
 * - next/image 사용 (next.config.ts에서 unoptimized: true → 원본 그대로 표시, Netlify에서도 안 깨짐)
 * - 사진을 못 불러오면 로컬 그림(/placeholder-yard.svg)으로 바꿉니다.
 * - 부모 요소에 크기(예: aspect-[4/3])와 relative가 있어야 합니다.
 */
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

export const PLACEHOLDER_IMAGE = "/placeholder-yard.svg";

export function SpaceImage({
  src,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
  priority,
}: {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const finalSrc = !src || failedSrc === src ? PLACEHOLDER_IMAGE : src;
  return (
    <Image
      src={finalSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
      onError={() => setFailedSrc(src ?? null)}
    />
  );
}
