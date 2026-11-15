"use client";

import dynamic from "next/dynamic";
import { Component, ReactNode, useEffect, useRef, useState } from "react";

// three.js only runs in the browser.
const LaptopScene = dynamic(() => import("./LaptopScene"), { ssr: false });

// If the 3D scene fails (no WebGL, a missing file), the section just stays
// empty instead of taking the whole page down.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

type LaptopShowcaseProps = {
  // Images shown on the laptop screen, one after another.
  screens: string[];
};

const LaptopShowcase = ({ screens }: LaptopShowcaseProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [running, setRunning] = useState(false);
  // The 3D scene (and the model) only loads once the section gets close, and
  // fades in when it is ready.
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) {
      setRunning(true);
      setMounted(true);
      return;
    }

    // The 3D scene only renders while the section is near the screen.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setRunning(entry.isIntersecting);
        if (entry.isIntersecting) {
          setMounted(true);
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-label="Ukázky designu na notebooku"
      className="laptop-scroll scroll-stack-section scroll-stack-section-02 hero-cover-next bg-[#080808]"
      ref={sectionRef}
    >
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-1000 ease-out ${ready ? "opacity-100" : "opacity-0"}`}
      >
        {mounted && (
          <SceneBoundary>
            <LaptopScene onReady={() => setReady(true)} running={running} screens={screens} />
          </SceneBoundary>
        )}
      </div>
    </section>
  );
};

export default LaptopShowcase;
