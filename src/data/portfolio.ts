export type Service = {
  title: string;
  skills: string[];
  image: string;
};

export type ProjectDetail = {
  description: string;
  facts: { label: string; value: string }[];
  sections: { title: string; text: string }[];
  // Items without an image show a placeholder with their label. `ratio` is the
  // tile aspect ratio for an image; tiles in one row should share it.
  gallery: { label: string; image?: string; ratio?: string; wide?: boolean }[];
  conclusion: string;
};

export type Project = {
  slug: string;
  name: string;
  type: string;
  image: string;
  mark: string;
  detail?: ProjectDetail;
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
    slug: "zadyfit",
    name: "ZadyFit",
    type: "Web design",
    image: "/jakub.png",
    mark: "ZadyFit",
    detail: {
      description:
        "Web pro fitness trenéra z Dubaje, který jsem navrhl během odborné praxe v pražském designovém studiu Groovia.",
      facts: [
        { label: "Klient", value: "ZadyFit" },
        { label: "Odvětví", value: "Fitness & zdraví" },
        { label: "Služba", value: "Web design" },
      ],
      sections: [
        {
          title: "Přehled",
          text: "Během praxe ve studiu Groovia mi zakladatel Ondřej Vazač díky mým předchozím zkušenostem svěřil reálný projekt, nový web pro fitness trenéra z Dubaje. Web jsem navrhoval přímo ve Frameru, ve kterém studio tvoří weby pro své klienty.",
        },
        {
          title: "Výzva",
          text: "Práce začala hloubkovou analýzou stávajícího webu klienta, ve které jsem hledal jeho chyby a slabá místa. Zároveň šlo o můj první projekt pro skutečného klienta.",
        },
        {
          title: "Řešení",
          text: "Jako inspiraci pro nový obsah jsem prošel deset různých webů a pak už navrhoval rovnou ve Frameru. Průběžně jsem se zakladatelem studia konzultoval práci s klientem, používané nástroje i postup při specifických požadavcích na web.",
        },
        {
          title: "Výsledek",
          text: "Hotový web je dnes jednou z referencí v mém portfoliu. Zakladatel studia Ondřej Vazač mou práci ocenil i veřejně. Na LinkedInu mi potvrdil dovednosti, napsal osobní doporučení a vyzdvihl ji ve svém příspěvku.",
        },
      ],
      gallery: [
        { label: "Reference klientů", image: "/zadyfit3.png", ratio: "2.14" },
        { label: "Rezervace konzultace", image: "/zadyfit2.png", ratio: "2.14" },
        { label: "Sekce s Instagramem", image: "/zadyfit1 (1).png", ratio: "2.14", wide: true },
      ],
      conclusion:
        "Práce v profesionálním studiu mi ukázala reálný proces tvorby digitálních produktů od vizuálního návrhu až po hotový web. Naučil jsem se efektivně pracovat ve Frameru, který výrazně zrychluje cestu od návrhu k funkčnímu výsledku.",
    },
  },
  {
    slug: "florise",
    name: "Florise",
    type: "Web design",
    image: "/01 Hero (video background 20 s).png",
    mark: "Florise",
    detail: {
      description:
        "Redesign webu pro firmu Florise, na kterém jsem pracoval během odborné praxe v pražském SMRK studiu.",
      facts: [
        { label: "Klient", value: "Florise" },
        { label: "Odvětví", value: "Zahradnictví" },
        { label: "Služba", value: "Web design" },
      ],
      sections: [
        {
          title: "Přehled",
          text: "Praxi jsem absolvoval v SMRK studiu v pražských Nuslích, které se zaměřuje na webový vývoj, webdesign a branding. Mým hlavním úkolem tam byl redesign webové stránky pro firmu Florise.",
        },
        {
          title: "Výzva",
          text: "Šlo o reálnou zakázku, takže nový web musel obstát před skutečným klientem. Zároveň jsem se potřeboval rychle zorientovat v nástrojích a postupech, které studio při tvorbě webů používá.",
        },
        {
          title: "Řešení",
          text: "Instruktor se mi plně a individuálně věnoval a ukázal mi řadu nových technik, které jsem dosud neznal. Díky nim jsem mohl na redesignu pracovat mnohem rychleji.",
        },
        {
          title: "Výsledek",
          text: "Redesign mi zůstal jako reference z reálné zakázky. Zároveň mi ukázala, jak vypadá práce na webu pro skutečného klienta v profesionálním studiu.",
        },
      ],
      gallery: [
        { label: "Co děláme", image: "/Florise 1.png", ratio: "4/3" },
        { label: "Realizované projekty", image: "/Florise 2.png", ratio: "4/3" },
        { label: "Jak spolupracujeme", image: "/Florise 3.png", ratio: "2527/855", wide: true },
      ],
      conclusion:
        "Redesign mi dal příležitost přemýšlet nad různými způsoby zpracování a hledat řešení, které bude fungovat pro klienta i jeho návštěvníky. Rady a postupy, které jsem ve studiu získal, chci dál využívat i ve vlastních projektech.",
    },
  },
  {
    slug: "smrk-studio",
    name: "SMRK studio",
    type: "Brand / grafika",
    image: "/Vizitky.png",
    mark: "SMRK",
    detail: {
      description:
        "Návrh vizitek pro SMRK studio, které jsem vytvořil během odborné praxe přímo pro potřeby studia.",
      facts: [
        { label: "Klient", value: "SMRK studio" },
        { label: "Odvětví", value: "Vizitky" },
        { label: "Služba", value: "Brand / grafika" },
      ],
      sections: [
        {
          title: "Přehled",
          text: "Kromě práce na webu jsem během praxe v SMRK studiu dostal za úkol navrhnout nové vizitky pro samotné studio. Vizitky měly navazovat na jeho vizuální identitu a slogan „Sázíme weby, které rostou“.",
        },
        {
          title: "Výzva",
          text: "Na malé ploše bylo potřeba spojit výrazné logo, slogan a všechny kontaktní údaje tak, aby vizitka zůstala přehledná a zároveň byla na první pohled poznat jako SMRK.",
        },
        {
          title: "Řešení",
          text: "Každé straně vizitky jsem dal jasnou roli. Přední strana patří značce, tedy logu a sloganu, aby si ji lidé hned spojili se studiem. Kontakty jsem přesunul na zadní stranu a doplnil QR kód, který člověka rovnou přivede na web. Tmavě a světle zelená drží obě strany v barvách studia.",
        },
        {
          title: "Výsledek",
          text: "Vznikla dvojice stran, které spolu barevně kontrastují, ale drží jednotný styl studia. Vizitka zůstala přehledná a díky QR kódu propojuje tištěnou podobu přímo s webem studia.",
        },
      ],
      gallery: [],
      conclusion:
        "Projekt mi ukázal, jak pracovat s existující vizuální identitou v tištěné podobě. Naučil jsem se na malém formátu rozhodnout, co je opravdu důležité, a dát každé informaci své místo.",
    },
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
