import { contact } from "@/data/portfolio";
import Arrow from "./Arrow";
import SectionLabel from "./SectionLabel";
import { contentPadding, socialLinks } from "./shared";

const SiteFooter = () => (
  <footer className={`scroll-reveal-section scroll-stack-section-07 ${contentPadding} bg-[#080808] pb-9 pt-16 sm:pt-22`}>
    <SectionLabel>PŘIPRAVENÝ TVOŘIT NĚCO NOVÉHO</SectionLabel>
    <div className="my-10 flex items-center justify-between sm:my-14">
      <h2 className="m-0 text-[3.3125rem] tracking-[-.08em] sm:text-[9vw]">
        POJĎME TVOŘIT
      </h2>
    </div>
    <div className="h-px bg-[#30302e]" />
    <div className="flex flex-col gap-3 whitespace-nowrap py-7 text-xl sm:flex-row sm:flex-wrap sm:justify-between sm:gap-x-10 sm:py-10 sm:text-3xl lg:text-[2.75rem]">
      <a href={`mailto:${contact.email}`}>{contact.email}</a>
      <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
        {contact.phone}
      </a>
    </div>
    <div className="h-px bg-[#30302e]" />
    <div className="grid gap-5 pt-6 font-mono text-[0.625rem] text-[#a5a5a2] sm:flex sm:items-center sm:justify-between">
      <span>©2026 HONZA</span>
      <div className="order-3 flex justify-between gap-2 text-[#f1f0ec] sm:order-none sm:gap-7">
        {socialLinks.map(({ label, href }) => (
          <a
            className="group flex items-center gap-1.5 transition-colors duration-500 ease-in-out hover:text-[#a5a5a2] focus-visible:text-[#a5a5a2]"
            href={href}
            key={label}
            rel="noopener noreferrer"
            target="_blank"
          >
            {label.toUpperCase()}{" "}
            {/* The arrow nudges up and to the right, towards where the link leads. */}
            <Arrow
              className="brightness-0 invert transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-60 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:opacity-60"
              size={12}
            />
          </a>
        ))}
      </div>
      <span>DESIGNED &amp; DEVELOPED BY ME</span>
    </div>
  </footer>
);

export default SiteFooter;
