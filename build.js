import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

const postsDir = "./posts";
const output = "./posts.json";

function generatePosts() {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith(".html"));
  const posts = [];
  files.forEach((file, index) => {
    const filePath = path.join(postsDir, file);
    const html = fs.readFileSync(filePath, "utf-8");
    const dom = new JSDOM(html);
    const doc = dom.window.document;
    const title = doc.querySelector("h1")?.textContent || "Tanpa Judul";
    const category = doc.querySelector("meta[name='category']")?.content || "Umum";
    const image = doc.querySelector("img")?.src || "https://placehold.co/600x400";
    const excerpt = doc.querySelector("p")?.textContent.slice(0, 150) + "...";
    const date = doc.querySelector("meta[name='date']")?.content || new Date().toISOString().split("T")[0];
    posts.push({ id: index + 1, title, category, image, excerpt, date });
  });
  fs.writeFileSync(output, JSON.stringify(posts, null, 2));
  console.log(`✅ ${posts.length} postingan berhasil digenerate ke posts.json`);
}

generatePosts();