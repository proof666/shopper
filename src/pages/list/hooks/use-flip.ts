import { useLayoutEffect, useRef } from "react";

type NodesMap = { [id: string]: HTMLElement | null };

// A small FLIP hook: attach refs with setRef(id) and pass the current ids array.
// It measures previous positions and applies transforms so items animate to new positions.
export default function useFlip<T extends { id: string }>(items: T[]) {
  const nodes = useRef<NodesMap>({});
  const positions = useRef<Record<string, DOMRect>>({});

  const setRef = (id: string) => (el: HTMLElement | null) => {
    nodes.current[id] = el;
  };

  useLayoutEffect(() => {
    // measure new positions
    const newPos: Record<string, DOMRect> = {};
    items.forEach((it) => {
      const el = nodes.current[it.id];
      if (el) newPos[it.id] = el.getBoundingClientRect();
    });

    // for each element that existed before and exists now, compute delta and animate
    Object.keys(newPos).forEach((id) => {
      const el = nodes.current[id];
      const prev = positions.current[id];
      const next = newPos[id];
      if (!el || !prev) return;
      const dx = prev.left - next.left;
      const dy = prev.top - next.top;
      if (dx === 0 && dy === 0) return;

      // apply inverse transform
      el.style.transition = "none";
      el.style.transform = `translate(${dx}px, ${dy}px)`;

      // force paint
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.offsetHeight;

      // animate to identity
      el.style.transition = "transform 300ms ease";
      el.style.transform = "";

      const cleanup = () => {
        if (!el) return;
        el.style.transition = "";
        el.style.transform = "";
        el.removeEventListener("transitionend", cleanup);
      };
      el.addEventListener("transitionend", cleanup);
    });

    // store positions for next tick
    positions.current = newPos;
  }, [items]);

  return { setRef };
}
