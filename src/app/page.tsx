/* =============================================================================
 * PAGE.TSX – úvodní stránka (adresa „/“)
 * -----------------------------------------------------------------------------
 * Jen vloží komponentu Portfolio, kde je celý obsah úvodní stránky
 * (hero, O mně, Služby, Projekty, Kontakt).
 * ========================================================================== */

import Portfolio from "@/components/Portfolio";

const Home = () => {
  return <Portfolio />;
};

export default Home;
