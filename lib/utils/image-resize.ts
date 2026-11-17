/**
 * 사진을 브라우저 안에서 작게 줄여 data URL(문자열)로 바꿉니다.
 * 프로토타입이라 서버에 올리지 않고, 이 문자열을 localStorage에 저장해 미리보기로만 씁니다.
 * (나중에 Supabase Storage로 바꾸면 여기서 파일을 업로드하고 주소를 돌려주면 됩니다.)
 */
export async function resizeImageFile(file: File, maxSize = 960, quality = 0.7): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("사진 파일만 올릴 수 있어요.");
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("사진을 읽지 못했어요. 다른 사진을 골라 주세요."));
      el.src = url;
    });
    const scale = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.round(img.naturalWidth * scale);
    const h = Math.round(img.naturalHeight * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("사진을 처리하지 못했어요.");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    URL.revokeObjectURL(url);
  }
}
