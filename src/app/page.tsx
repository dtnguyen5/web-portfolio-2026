import { readdirSync } from "node:fs";
import { join } from "node:path";
import Portfolio from "@/components/Portfolio";

// Order on the laptop screen: websites first, then posters, then branding.
// Images in public/laptop that aren't listed here follow in file name order.
const laptopOrder = [
  // Websites
  "Luxusní automobilové leštění v černobílém stylu.png",
  "boty.jpg",
  // Posters
  "Mercedes.jpg",
  "jidlo.jpg",
  // Branding
  "Kitzu.jpg",
  "logo.jpg",
];

// Read on render, so images added while the dev server runs show up after a reload.
const readLaptopScreens = () => {
  const rank = (file: string) => {
    const index = laptopOrder.indexOf(file.normalize("NFC"));
    return index === -1 ? laptopOrder.length : index;
  };

  return readdirSync(join(process.cwd(), "public/laptop"))
    .filter((file) => /\.(jpe?g|png|webp|avif)$/i.test(file))
    .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, "cs"))
    .map((file) => `/laptop/${encodeURIComponent(file)}`);
};

const Home = () => {
  return <Portfolio laptopScreens={readLaptopScreens()} />;
};

export default Home;
