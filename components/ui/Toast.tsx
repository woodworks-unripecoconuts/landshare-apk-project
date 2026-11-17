"use client";

/**
 * 화면 아래에 잠깐 떴다 사라지는 알림 메시지.
 * 사용법: const toast = useToast(); toast("등록했어요!");
 */
import { createContext, useCallback, useContext, useState } from "react";

type ToastItem = { id: number; text: string; tone: "info" | "error" };
type ToastFn = (text: string, tone?: "info" | "error") => void;

const ToastContext = createContext<ToastFn>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback<ToastFn>((text, tone = "info") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-8"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={
              "pointer-events-auto max-w-sm rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg " +
              (t.tone === "error" ? "bg-red-600" : "bg-ink")
            }
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastFn {
  return useContext(ToastContext);
}
