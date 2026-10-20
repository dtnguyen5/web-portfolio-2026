type SectionLabelProps = {
  children: string;
  number?: string;
};

const SectionLabel = ({ children, number }: SectionLabelProps) => (
  <div className="flex justify-between font-mono text-xs leading-6 tracking-wide text-[#a5a5a2]">
    <span>{children}</span>
    {number && <span>{number}</span>}
  </div>
);

export default SectionLabel;
