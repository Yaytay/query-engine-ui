import React, { useCallback, useLayoutEffect, useRef } from "react";

type AutoResizeTextAreaProps = Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> & {
  value: string;
  minRows?: number;
  maxRows?: number;
};

export function AutoResizeTextArea({
  value,
  minRows = 1,
  maxRows,
  style,
  ...props
}: AutoResizeTextAreaProps) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    el.style.height = "0px";

    const cs = window.getComputedStyle(el);
    const lineHeight = Number.parseFloat(cs.lineHeight || "0");
    const paddingTop = Number.parseFloat(cs.paddingTop || "0");
    const paddingBottom = Number.parseFloat(cs.paddingBottom || "0");
    const borderTop = Number.parseFloat(cs.borderTopWidth || "0");
    const borderBottom = Number.parseFloat(cs.borderBottomWidth || "0");

    const verticalExtras = paddingTop + paddingBottom + borderTop + borderBottom;

    const minHeight = lineHeight
      ? minRows * lineHeight + verticalExtras
      : el.scrollHeight;

    const maxHeight =
      maxRows && lineHeight ? maxRows * lineHeight + verticalExtras : Infinity;

    const next = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);

    el.style.height = `${next}px`;
    el.style.overflowY = next >= maxHeight ? "auto" : "hidden";
  }, [minRows, maxRows]);

  useLayoutEffect(() => {
    resize();
    // Resize when width/font changes (wrapping changes scrollHeight)
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver(() => resize());
    ro.observe(el);

    return () => ro.disconnect();
  }, [value, minRows, maxRows, resize]);

  return (
    <textarea
      {...props}
      ref={ref}
      value={value}
      onChange={(e) => {
        props.onChange?.(e);
        // For controlled components, value updates trigger the effect anyway,
        // but this gives immediate resizing during input.
        requestAnimationFrame(resize);
      }}
      style={{
        ...style,
        resize: "none", // user can't drag; component auto-sizes
        overflowY: "hidden",
      }}
    />
  );
}