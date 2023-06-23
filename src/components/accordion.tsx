import React, { useRef, useState } from "react";
import { useMutationObserver } from "@react-hooks-library/core";

export const Accordion: React.FC<
  React.PropsWithChildren<{ controlText?: string; open?: boolean; renderClosed?: boolean }>
> = ({ children, controlText = "Expand", open = false, renderClosed }) => {
  const ref = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(open);
  const { isSupported } = useMutationObserver(ref, (ms) => setIsOpen((ms.at(-1)?.target as HTMLDetailsElement).open), {
    attributeFilter: ["open"],
  });

  return (
    <details {...{ open, ref }}>
      <summary className="w-fit cursor-pointer rounded bg-slate-200 p-2">{controlText}</summary>
      {(renderClosed || isOpen || !isSupported) && (
        <div className="my-4">
          <React.Suspense fallback="Loading...">{children}</React.Suspense>
        </div>
      )}
    </details>
  );
};
