import puppeteer from "puppeteer-core";

const [, , url, outPath, widthStr, heightStr, isMobileStr, locale] = process.argv;
const width = parseInt(widthStr || "1440", 10);
const height = parseInt(heightStr || "900", 10);
const isMobile = isMobileStr === "mobile";

const CHROME_PATH = "C:/Program Files/Google/Chrome/Application/chrome.exe";

const launchArgs = ["--hide-scrollbars", "--disable-gpu"];
if (locale) {
  launchArgs.push(`--lang=${locale}`);
}

const browser = await puppeteer.launch({
  executablePath: CHROME_PATH,
  headless: true,
  args: launchArgs,
});

const page = await browser.newPage();

if (locale) {
  await page.setExtraHTTPHeaders({ "Accept-Language": `${locale},${locale.split("-")[0]};q=0.9` });
  await page.evaluateOnNewDocument((loc) => {
    Object.defineProperty(navigator, "language", { get: () => loc });
    Object.defineProperty(navigator, "languages", { get: () => [loc] });
  }, locale);
}

if (isMobile) {
  await page.setUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  );
}

await page.setViewport({ width, height, isMobile, hasTouch: isMobile });
await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

// wait for any preloader/intro animation to settle, and nudge a scroll
// to trigger lazy/scroll-based reveal animations
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

await wait(4000);
await page.evaluate(() => window.scrollTo(0, 50));
await wait(1000);
await page.evaluate(() => window.scrollTo(0, 0));
await wait(3000);

await page.screenshot({ path: outPath });

await browser.close();
console.log(`Saved ${outPath}`);
