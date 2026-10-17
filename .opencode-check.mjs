import { chromium } from "playwright-core";

const browser = await chromium.launch({ channel: "msedge" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

const info = await page.evaluate(() => {
  const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(
    (l) => l.href,
  );
  const bar = document.querySelector(".glass");
  const range = document.querySelector(".saloon-range");
  return {
    links,
    glassFound: !!bar,
    backdrop: bar ? getComputedStyle(bar).backdropFilter : null,
    rangeFound: !!range,
    rangeAppearance: range ? getComputedStyle(range).appearance : null,
    rangeHeight: range ? getComputedStyle(range).height : null,
  };
});

console.log(JSON.stringify(info, null, 2));

for (const href of info.links) {
  const res = await page.request.get(href);
  const text = await res.text();
  console.log(
    `${href} len=${text.length} saloon-range=${text.includes("saloon-range")} glass=${text.includes(".glass")}`,
  );
}
await browser.close();
