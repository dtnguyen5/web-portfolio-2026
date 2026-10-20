import { services } from "@/data/portfolio";

const ServiceList = () => (
  <div>
    {services.map((service, index) => (
      <article
        className="min-h-[241px] border-t border-[#30302e] py-7 sm:grid sm:min-h-[182px] sm:grid-cols-[56px_1fr_560px] sm:gap-6 sm:py-10"
        key={service.title}
      >
        <div className="flex justify-between font-mono text-xs text-[#a5a5a2]">
          {String(index + 1).padStart(2, "0")}
        </div>
        <h3 className="mt-11 text-[25px] tracking-[-.04em] sm:mt-0 sm:text-[34px]">
          {service.title}
        </h3>
        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-[#a5a5a2] sm:mt-0 sm:text-base">
          {service.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </article>
    ))}
  </div>
);

export default ServiceList;
