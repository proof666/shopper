import { useRef, useState, useCallback } from "react";

export function useSwipe(onDelete?: (id: string) => void) {
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const activeTouchId = useRef<string | null>(null);
  const [swipeTranslate, setSwipeTranslate] = useState<Record<string, number>>(
    {}
  );

  const bindTouchHandlers = useCallback(
    (id: string) => ({
      onTouchStart: (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        activeTouchId.current = id;
        setSwipeTranslate((s) => ({ ...s, [id]: 0 }));
      },
      onTouchMove: (e: React.TouchEvent) => {
        if (activeTouchId.current !== id) return;
        const cx = e.touches[0].clientX;
        const cy = e.touches[0].clientY;
        const dx = cx - (touchStartX.current ?? cx);
        const dy = cy - (touchStartY.current ?? cy);
        if (Math.abs(dy) > Math.abs(dx)) return;
        const tx = Math.min(0, dx);
        setSwipeTranslate((s) => ({ ...s, [id]: tx }));
      },
      onTouchEnd: () => {
        const tx = swipeTranslate[id] || 0;
        if (tx < -60 && onDelete) onDelete(id);
        setSwipeTranslate((s) => {
          const copy = { ...s };
          delete copy[id];
          return copy;
        });
        touchStartX.current = null;
        touchStartY.current = null;
        activeTouchId.current = null;
      },
    }),
    [swipeTranslate, onDelete]
  );

  return { swipeTranslate, bindTouchHandlers } as const;
}
