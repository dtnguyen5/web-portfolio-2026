"use client";

import { useEffect, useRef } from "react";

const SmoothCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) {
      return;
    }

    let targetX = -100;
    let targetY = -100;
    let currentX = targetX;
    let currentY = targetY;
    let animationFrame = 0;

    const moveCursor = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.style.opacity = "1";
    };

    const hideCursor = () => {
      cursor.style.opacity = "0";
    };

    const animateCursor = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      animationFrame = requestAnimationFrame(animateCursor);
    };

    window.addEventListener("mousemove", moveCursor);
    document.documentElement.addEventListener("mouseleave", hideCursor);
    animationFrame = requestAnimationFrame(animateCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.documentElement.removeEventListener("mouseleave", hideCursor);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] hidden h-8 w-8 rounded-full border-2 border-transparent opacity-0 transition-opacity duration-200 md:block"
      ref={cursorRef}
      style={{ borderColor: "#ffffff" }}
    />
  );
};

export default SmoothCursor;
