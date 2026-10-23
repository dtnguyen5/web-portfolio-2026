export type Service = {
  title: string;
  skills: string[];
  image: string;
};

export type Project = {
  name: string;
  type: string;
  image: string;
  mark: string;
};

export const services: Service[] = [
  {
    title: "UI / UX DESIGN",
    image: "/service-uiux.jpg",
    skills: [
      "Wireframing",
      "Prototypování",
      "Design systémy",
      "Web design",
      "Landing pages",
      "Design aplikací",
    ],
  },
  {
    title: "WEB DEVELOPMENT",
    image: "/service-webdev.jpg",
    skills: [
      "Next.js",
      "TypeScript",
      "Responzivní web",
      "Framer",
      "Git",
      "SEO",
    ],
  },
  {
    title: "BRAND / GRAFIKA",
    image: "/service-brand.jpg",
    skills: [
      "Logo",
      "Vizuální styl",
      "Social media",
      "Plakáty",
      "Ilustrace",
      "Packaging",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "ZadyFit",
    type: "Web design",
    image: "/jakub.png",
    mark: "ZadyFit",
  },
  {
    name: "Florise",
    type: "Web design",
    image: "/01 Hero (video background 20 s).png",
    mark: "Florise",
  },
  {
    name: "Projekt 03",
    type: "Brand / web",
    image: "/project-code.png",
    mark: "</>",
  },
];

export const tools = [
  "Figma",
  "Framer",
  "Affinity",
  "Photoshop",
  "Illustrator",
  "React",
  "Next.js",
  "Git",
];

export const experience = {
  school: {
    label: "ŠKOLA",
    title: "Střední škola informatiky a finančních služeb",
    description: ["Obor: Informační technologie", "Zaměření: Grafika na PC"],
  },
  jobs: [
    {
      label: "PRAXE · ÚNOR 2026",
      title: "Groovio",
      description: "Web designér",
    },
    {
      label: "PRAXE · ŘÍJEN 2026",
      title: "Smrk studio",
      description: "Web designér | Grafický designér",
    },
  ],
};

export const contact = {
  email: "duytiepn1@gmail.com",
  phone: "+420 608 088 388",
};
