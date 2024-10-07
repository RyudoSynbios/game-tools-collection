import fs from "fs";
import moment from "moment";

const urls = [
  { url: "/", lastmod: moment().format("YYYY-MM-DD") },
  { url: "/about", lastmod: moment().format("YYYY-MM-DD") },
  { url: "/faq", lastmod: moment().format("YYYY-MM-DD") },
];

const file = fs.readFileSync("./src/lib/db/games.json", "utf8");

const games = JSON.parse(file);

games.forEach((game) => {
  Object.entries(game.tools).forEach(([key, value]) => {
    const tool = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

    urls.push({ url: `/${game.id}/${tool}`, lastmod: value.createdAt });
  });
});

let sitemap =
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

urls.forEach(
  (item) =>
    (sitemap += `\n  <url>
    <loc>https://game-tools-collection.com${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
  </url>`),
);

sitemap += "\n</urlset>";

fs.writeFileSync("./build/client/sitemap.xml", sitemap);
