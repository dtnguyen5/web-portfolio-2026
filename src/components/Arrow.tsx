/* =============================================================================
 * ARROW – šipka ↗ (public/arrow-up-right.svg)
 * -----------------------------------------------------------------------------
 * Používá se u odkazů a tlačítek. Je jen dekorace, čtečky obrazovky ji přeskočí.
 * Použití: <Arrow size={12} className="…" />
 * ========================================================================== */

import Image from "next/image";

type ArrowProps = {
  className?: string; // vlastní třídy (barva, animace při hoveru…)
  size?: number; // velikost v px (výchozí 20)
};

const Arrow = ({ className = "", size = 20 }: ArrowProps) => (
  <Image
    aria-hidden="true"
    className={className}
    src="/arrow-up-right.svg"
    alt=""
    width={size}
    height={size}
  />
);

export default Arrow;
