import test, { type Page } from "@playwright/test";

export async function selectRegion(page: Page, region: string): Promise<void> {
  await page.waitForSelector(".gtc-regionmodal ul");

  const lis = page.locator(".gtc-regionmodal ul li");

  const regionsTexts = await lis.allInnerTexts();

  const index = regionsTexts.findIndex((item) => item.toLowerCase() === region);

  test.expect(index).toBeGreaterThan(-1);

  await lis.nth(index).click();
}
