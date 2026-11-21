"use client";

import { useEffect, useRef } from "react";

const SmoothCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const view = viewRef.current;

    if (!cursor || !view) {
      return;
    }

    let targetX = -100;
    let targetY = -100;
    let currentX = targetX;
    let currentY = targetY;
    let animationFrame = 0;
    let checkFrame = 0;

    // Over elements marked with `data-cursor="view"` a light "open" circle
    // grows over the ring.
    // The event target isn't always an Element (Firefox can report `document`
    // or a text node), and those have no `closest`.
    const updateView = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      view.toggleAttribute("data-active", !!element?.closest('[data-cursor="view"]'));
    };

    const moveCursor = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.style.opacity = "1";
      updateView(event.target);
    };

    // Scrolling moves the page under a still mouse, e.g. onto a project card.
    // Checked at most once a frame.
    const checkUnderCursor = () => {
      if (!checkFrame) {
        checkFrame = requestAnimationFrame(() => {
          checkFrame = 0;
          updateView(document.elementFromPoint(targetX, targetY));
        });
      }
    };

    const hideCursor = () => {
      cursor.style.opacity = "0";
      updateView(null);
    };

    const animateCursor = () => {
      // Skip the style write while the ring has caught up with the mouse.
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
        view.style.transform = cursor.style.transform;
      }
      animationFrame = requestAnimationFrame(animateCursor);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("scroll", checkUnderCursor, { passive: true });
    document.documentElement.addEventListener("mouseleave", hideCursor);
    animationFrame = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("scroll", checkUnderCursor);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
      cancelAnimationFrame(animationFrame);
      cancelAnimationFrame(checkFrame);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 rounded-full border-2 border-transparent opacity-0 transition-opacity duration-200 md:block"
        ref={cursorRef}
        style={{ borderColor: "#ffffff" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[101] hidden md:block"
        ref={viewRef}
      >
        <div className="view-cursor grid h-20 w-20 place-items-center rounded-full bg-[#f1f0ec] text-[#080808]">
          <svg
            width="22"
            height="22"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M14.166 14.166V5.834H5.834M14.166 5.834L5.834 14.166" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default SmoothCursor;
