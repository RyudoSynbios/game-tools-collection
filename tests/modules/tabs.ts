export async function expectTabs(
  expectedValue: string,
  inputIndex: number,
): Promise<void> {
  await page.waitForSelector(".gtc-tabs > ul");

  const ulsEl = await page.$$(".gtc-tabs > ul");
  const ulEl = ulsEl[inputIndex];

  const tabs = await ulEl?.$$eval(".gtc-tab:not(.gtc-tab-disabled)", (els) =>
    els.map((el) => el.textContent?.trim()),
  );

  expect(JSON.stringify(tabs)).toBe(expectedValue);
}

export async function selectTab(tab: string, tabIndex: number): Promise<void> {
  const tabsEl = await page.$$(".gtc-tabs > ul");
  const tabEl = await tabsEl[tabIndex].$(`li:nth-child(${tab})`);

  await tabEl?.click();
}
