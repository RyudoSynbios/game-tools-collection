import test, { type Page } from "@playwright/test";

export async function expectChecksum(
  page: Page,
  expectedValue: string,
  inputIndex: number,
): Promise<void> {
  await page.locator(".gtc-tool-checksums").click();

  const checksum = page.locator("input[data-checksum=true]").nth(inputIndex);

  test.expect(checksum).toHaveValue(expectedValue);
}
