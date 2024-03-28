export async function expectChecksum(
  expectedValue: string,
  inputIndex: number,
): Promise<void> {
  const checksumButtonEl = await page.$(".gtc-tool-checksums");

  await checksumButtonEl?.click();

  const inputsEl = await page.$$("input[data-checksum=true]");
  const inputEl = inputsEl[inputIndex];

  const checksum = await page.evaluate((el) => el.value, inputEl);

  expect(checksum).toBe(expectedValue);
}
