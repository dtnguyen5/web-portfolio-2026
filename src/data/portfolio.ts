/* =============================================================================
 * DATA PORTFOLIA – všechny texty a obsah na jednom místě
 * -----------------------------------------------------------------------------
 * Když chceš změnit text, přidat projekt nebo službu, stačí upravit tenhle
 * soubor – komponenty si data berou odsud.
 *
 *   services    – služby (sekce Služby)
 *   projects    – projekty (karty + stránky detailu /projekty/<slug>)
 *   tools       – nástroje (sekce O mně → 03 Nástroje)
 *   experience  – škola a praxe (sekce O mně → 02 Škola & praxe)
 *   contact     – e-mail a telefon (patička, mobilní menu)
 *
 * Obrázky patří do složky public/ a píšou se s lomítkem na začátku: "/obrazek.png".
 * Když obrázek vyměníš, ulož ho pod NOVÝM názvem (např. -v2), jinak se může
 * zobrazovat stará verze z cache.
 * ========================================================================== */

/* =============================================================================
 * TYPY – popisují, jaká pole musí mít služba / projekt
 * ========================================================================== */

// Jedna služba v sekci Služby
export type Service = {
  title: string; // název (velkými písmeny)
  skills: string[]; // dovednosti – zobrazí se ve dvou sloupcích
  image: string; // náhled, který se ukáže u kurzoru při najetí myší
};

// Obsah stránky detailu projektu
export type ProjectDetail = {
  description: string; // krátký popis pod názvem (a na kartách „Další projekty“)
  facts: { label: string; value: string }[]; // fakta vedle sebe (Klient, Odvětví, Služba)
  sections: { title: string; text: string }[]; // textové sekce (Přehled, Výzva, Řešení, Výsledek)
  // Galerie. Položka bez `image` ukáže zástupný rámeček s popiskem.
  // `ratio` = poměr stran obrázku (např. "4/3"); obrázky v jedné řadě by ho měly mít stejný.
  // `wide: true` = obrázek přes celou šířku.
  gallery: { label: string; image?: string; ratio?: string; wide?: boolean }[];
  conclusion: string; // text v sekci Závěr
};

// Jeden projekt
export type Project = {
  slug: string; // část adresy: /projekty/<slug> (malá písmena, bez mezer)
  name: string; // název projektu
  type: string; // štítek na kartě (Web design, Grafický design…)
  image: string; // hlavní obrázek (karta + detail)
  // Poměr stran obrázku (šířka/výška), aby se dal ukázat neořezaný.
  imageRatio: string;
  // true pro obrázky na jednobarevném pozadí (ne screenshoty webu) – nikdy se
  // neořezávají, volné místo kolem vyplní černé pozadí.
  imageContain?: boolean;
  mark: string; // zkrácený název (momentálně se na webu nikde nezobrazuje)
  // Obsah detailu. Bez něj karta nevede na detail, ale na kontaktní formulář.
  detail?: ProjectDetail;
};

/* =============================================================================
 * SLUŽBY (sekce „Moje služby“) – pořadí zde = pořadí na webu
 * ========================================================================== */
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

/* =============================================================================
 * PROJEKTY (sekce „Zpracované projekty“) – pořadí zde = pořadí karet
 * ========================================================================== */
export const projects: Project[] = [
  /* --- 01 ZadyFit --- */
  {
    slug: "zadyfit",
    name: "ZadyFit",
    type: "Web design",
    image: "/jakub.png",
    imageRatio: "2532/1188",
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
  /* --- 02 Deli Viet --- */
  {
    slug: "deliviet",
    name: "Deli Viet",
    type: "Web design",
    image: "/DeliViet1-v2.png",
    imageRatio: "1440/900",
    mark: "Deli Viet",
    detail: {
      description:
        "Návrh webu pro vietnamskou restauraci Deli Viet, který staví na výrazné typografii a fotkách jídel.",
      facts: [
        { label: "Klient", value: "Deli Viet" },
        { label: "Odvětví", value: "Gastronomie" },
        { label: "Služba", value: "Web design" },
      ],
      sections: [
        {
          title: "Přehled",
          text: "Deli Viet je vietnamská restaurace s nabídkou přes 30 jídel z čerstvých surovin. Cílem bylo navrhnout web, který návštěvníkům rychle ukáže menu a navnadí je k objednávce.",
        },
        {
          title: "Výzva",
          text: "Web musel přenést atmosféru restaurace a chuť jídel na obrazovku a zároveň zůstat přehledný. Návštěvník měl během pár vteřin pochopit, co restaurace nabízí, a snadno se dostat k menu nebo objednávce.",
        },
        {
          title: "Řešení",
          text: "Postavil jsem web na kontrastu výrazného kondenzovaného písma a velkých fotek jídel. Hlavní výzvy k akci jsem odlišil výraznou barvou, menu jsem rozdělil do přehledných kategorií a nejoblíbenější jídla představil v samostatné sekci specialit.",
        },
        {
          title: "Výsledek",
          text: "Vznikl web s jasnou identitou, který působí chutně a moderně. Výrazná typografie a fotky jídel drží jednotný styl napříč všemi sekcemi.",
        },
      ],
      gallery: [
        { label: "Nahlédněte do naší kuchyně", image: "/DeliViet2.png", ratio: "4/3" },
        { label: "Kategorie menu", image: "/DeliViet4.png", ratio: "4/3" },
        { label: "Speciality", image: "/DeliViet3.png", ratio: "1440/897", wide: true },
      ],
      conclusion:
        "Projekt mi ukázal, jak velkou roli hraje v gastronomii fotografie a typografie. Naučil jsem se navrhovat web tak, aby vzbudil chuť a zároveň vedl návštěvníka rovnou k objednávce.",
    },
  },
  /* --- 03 Florise --- */
  {
    slug: "florise",
    name: "Florise",
    type: "Web design",
    image: "/01 Hero (video background 20 s).png",
    imageRatio: "1440/900",
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
  /* --- 04 SMRK studio (vizitky) --- */
  {
    slug: "smrk-studio",
    name: "SMRK studio",
    type: "Grafický design",
    image: "/Vizitky.png",
    imageRatio: "2690/1300",
    imageContain: true,
    mark: "SMRK",
    detail: {
      description:
        "Návrh vizitek pro SMRK studio, které jsem vytvořil během odborné praxe přímo pro potřeby studia.",
      facts: [
        { label: "Klient", value: "SMRK studio" },
        { label: "Odvětví", value: "Vizitky" },
        { label: "Služba", value: "Grafický design" },
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
      gallery: [], // bez galerie – sekce se na stránce nezobrazí
      conclusion:
        "Projekt mi ukázal, jak pracovat s existující vizuální identitou v tištěné podobě. Naučil jsem se na malém formátu rozhodnout, co je opravdu důležité, a dát každé informaci své místo.",
    },
  },
];

/* =============================================================================
 * NÁSTROJE (O mně → 03 / 03 Nástroje)
 * ========================================================================== */
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

/* =============================================================================
 * ŠKOLA & PRAXE (O mně → 02 / 03)
 * ========================================================================== */
export const experience = {
  school: {
    label: "ŠKOLA",
    title: "Střední škola informatiky a finančních služeb",
    description: ["Obor: Informační technologie", "Zaměření: Grafika na PC"], // každá položka = nový řádek
  },
  // Praxe / práce – každá dostane vlastní řádek s čarou nad sebou
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

/* =============================================================================
 * KONTAKT (patička, mobilní menu)
 * ========================================================================== */
export const contact = {
  email: "duytiepn1@gmail.com",
  phone: "+420 608 088 388",
};
