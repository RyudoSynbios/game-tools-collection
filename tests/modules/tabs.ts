import test, { type Page } from "@playwright/test";

export async function expectTabs(
  page: Page,
  expectedValue: string,
  inputIndex: number,
): Promise<void> {
  await page.waitForSelector(".gtc-tabs > ul");

  const ul = page.locator(".gtc-tabs > ul").nth(inputIndex);
  const tabs = ul.locator(".gtc-tab:not(.gtc-tab-disabled)");

  const tabsTexts = await tabs.allInnerTexts();

  test.expect(JSON.stringify(tabsTexts)).toBe(expectedValue);
}

export async function selectTab(
  page: Page,
  tabIndex: string,
  tabsIndex: number,
): Promise<void> {
  await page.waitForSelector(".gtc-tabs > ul");

  const tabs = page.locator(".gtc-tabs > ul").nth(tabsIndex);
  const tab = tabs.locator("li").nth(parseInt(tabIndex) - 1);

  await tab.click();
}
