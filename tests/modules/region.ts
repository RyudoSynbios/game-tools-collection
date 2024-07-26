export async function selectRegion(region: string): Promise<void> {
  await page.waitForSelector(".gtc-regionmodal > ul");

  const regionsEl = await page.$$eval(".gtc-regionmodal ul li", (els) =>
    els.map((el) => el.textContent?.trim()),
  );

  const index = regionsEl.findIndex(
    (item) => item?.toLocaleLowerCase() === region,
  );

  expect(index).toBeGreaterThan(-1);

  await page.click(`.gtc-regionmodal ul li:nth-child(${index + 1})`);
}
