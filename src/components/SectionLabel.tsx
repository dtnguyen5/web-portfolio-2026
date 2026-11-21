/* =============================================================================
 * SECTION LABEL – malý šedý popisek nad sekcí („O MNĚ“, „SLUŽBY“…)
 * -----------------------------------------------------------------------------
 * Vlevo text, vpravo volitelně číslo.
 * Použití: <SectionLabel number="02">SLUŽBY</SectionLabel>
 * ========================================================================== */

type SectionLabelProps = {
  children: string; // text popisku
  number?: string; // číslo vpravo (nepovinné)
};

const SectionLabel = ({ children, number }: SectionLabelProps) => (
  <div className="flex justify-between font-mono text-xs leading-6 tracking-wide text-[#a5a5a2]">
    <span>{children}</span>
    {number && <span>{number}</span>}
  </div>
);

export default SectionLabel;
