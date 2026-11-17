"use client";

/** 사진 고르기 + 미리보기 (실제 업로드는 하지 않음). 첫 번째 사진이 대표 사진이에요. */
import { useRef, useState } from "react";
import { ArrowLeft, ImagePlus, X } from "lucide-react";
import { resizeImageFile } from "@/lib/utils/image-resize";
import { SpaceImage } from "@/components/space/SpaceImage";

export function PhotoPicker({
  value,
  onChange,
  max = 5,
}: {
  value: string[];
  onChange: (photos: string[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    setBusy(true);
    try {
      const room = max - value.length;
      const picked = Array.from(files).slice(0, room);
      const urls: string[] = [];
      for (const f of picked) urls.push(await resizeImageFile(f));
      onChange([...value, ...urls]);
      if (files.length > room) setError(`사진은 최대 ${max}장까지 올릴 수 있어요.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "사진을 올리지 못했어요.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const move = (i: number) => {
    if (i === 0) return;
    const next = value.slice();
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {value.map((src, i) => (
          <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-soil-100">
            <SpaceImage src={src} alt={`사진 ${i + 1}`} sizes="160px" />
            {i === 0 && (
              <span className="absolute top-1 left-1 rounded-full bg-grass-600 px-2 py-0.5 text-[11px] font-bold text-white">
                대표
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              aria-label={`사진 ${i + 1} 삭제`}
              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
            >
              <X className="size-4" />
            </button>
            {i > 0 && (
              <button
                type="button"
                onClick={() => move(i)}
                aria-label={`사진 ${i + 1} 앞으로`}
                className="absolute bottom-1 left-1 rounded-full bg-white/90 p-1 text-soil-800"
              >
                <ArrowLeft className="size-4" />
              </button>
            )}
          </div>
        ))}
        {value.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-soil-300 bg-white text-sm text-soil-600 hover:bg-soil-50"
          >
            <ImagePlus className="size-6" />
            {busy ? "줄이는 중…" : `사진 추가 (${value.length}/${max})`}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => onFiles(e.target.files)}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
