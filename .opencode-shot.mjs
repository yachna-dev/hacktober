import { chromium } from "playwright-core";

const out = "C:/Users/ap877/AppData/Local/Temp/opencode/shots";
const base = "http://localhost:3000";
const browser = await chromium.launch({ channel: "msedge" });

async function shot(name, w, h, url, steps) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  if (steps) await steps(page);
  await page.screenshot({ path: `${out}/${name}.png` });
  await page.close();
  console.log("shot", name);
}

async function pickVibe(page, latin) {
  await page.getByRole("button", { name: "Change the vibe" }).click();
  await page.waitForTimeout(500);
  await page.getByText(latin, { exact: true }).click();
  await page.waitForTimeout(900);
}

await shot("saloon-desktop", 1440, 900, `${base}/`);
await shot("saloon-vibes-modal", 1440, 900, `${base}/`, async (page) => {
  await page.getByRole("button", { name: "Change the vibe" }).click();
  await page.waitForTimeout(700);
});
await shot("saloon-chai", 1440, 900, `${base}/`, async (page) => {
  await pickVibe(page, "Chai Ki Tapri");
});
await shot("saloon-chai-play", 1440, 900, `${base}/`, async (page) => {
  await page.getByRole("button", { name: "Tap to play music" }).click();
  await page.waitForTimeout(1500);
});
await shot("saloon-qawali-play", 1440, 900, `${base}/`, async (page) => {
  await pickVibe(page, "Qawali");
  await page.getByRole("button", { name: "Tap to play music" }).click();
  await page.waitForTimeout(1500);
});
await shot("saloon-songs-modal", 1440, 900, `${base}/`, async (page) => {
  await pickVibe(page, "Raining Barish");
  await page.getByRole("button", { name: "Songs" }).click();
  await page.waitForTimeout(700);
});
await shot("saloon-mobile", 390, 844, `${base}/`);
await shot("saloon-mobile-modal", 390, 844, `${base}/`, async (page) => {
  await page.getByRole("button", { name: "Change the vibe" }).click();
  await page.waitForTimeout(700);
});
await shot("mahol-desktop", 1440, 900, `${base}/mahol`);

await browser.close();
