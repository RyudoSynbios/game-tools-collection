export async function expectChecksums(
  expectedValue: string,
  inputIndex: number,
): Promise<void> {
  const checksumButtonEl = await page.$(".gtc-editor-checksums");

  await checksumButtonEl?.click();

  const inputsEl = await page.$$("input[data-checksum=true]");
  const inputEl = inputsEl[inputIndex];

  const checksum = await page.evaluate((el) => el.value, inputEl);

  expect(checksum).toBe(expectedValue);
}
