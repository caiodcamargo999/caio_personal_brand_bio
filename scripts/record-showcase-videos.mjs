import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("public/videos/showcase");
const TMP_DIR = path.resolve(".tmp-recordings");

const TARGETS = [
  { name: "project-one", url: "https://cilexibiza.com/" },
  { name: "project-two", url: "https://elicoach.com/" },
  { name: "project-three", url: "https://drtatim.com.br/metodostart/" },
  { name: "project-four", url: "https://metaisdaterra.com.br/" },
];

const VIEWPORT = { width: 1440, height: 900 };
const SCROLL_STEPS = 40;
const STEP_DELAY_MS = 250;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

const browser = await chromium.launch();

for (const target of TARGETS) {
  console.log(`Recording ${target.name} -> ${target.url}`);
  const context = await browser.newContext({
    viewport: VIEWPORT,
    recordVideo: { dir: TMP_DIR, size: VIEWPORT },
  });
  const page = await context.newPage();

  try {
    await page.goto(target.url, { waitUntil: "load", timeout: 60000 });
    await page.waitForTimeout(1500);

    const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
    const maxScroll = Math.max(scrollHeight - VIEWPORT.height, 0);

    for (let i = 0; i <= SCROLL_STEPS; i++) {
      const y = Math.round((maxScroll * i) / SCROLL_STEPS);
      await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
      await page.waitForTimeout(STEP_DELAY_MS);
    }

    await page.waitForTimeout(1000);
  } catch (err) {
    console.error(`Error recording ${target.name}:`, err.message);
  }

  const video = page.video();
  await context.close();

  if (video) {
    const videoPath = await video.path();
    const destPath = path.join(OUT_DIR, `${target.name}.webm`);
    fs.copyFileSync(videoPath, destPath);
    console.log(`Saved ${destPath}`);
  }
}

await browser.close();
fs.rmSync(TMP_DIR, { recursive: true, force: true });
console.log("Done.");
