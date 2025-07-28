import test, { type Page } from "@playwright/test";

export async function expectInput(
  page: Page,
  expectedValue: string,
  inputIndex: number,
  shouldReturn = true,
): Promise<void> {
  await page.waitForSelector(".gtc-content");

  const input = page.locator("*[data-test=true]").nth(inputIndex);

  const inputValue = await input.evaluate(async (el) => {
    const inputEl = el as HTMLInputElement;

    switch (el.tagName) {
      case "INPUT":
        return inputEl.value.trim();
      case "SELECT":
        const optionEl = inputEl.querySelector(
          `option[value="${inputEl.value}"]`,
        ) as HTMLOptionElement;

        return optionEl?.textContent?.trim() || "";
    }
  });

  if (shouldReturn) {
    test.expect(inputValue).toBe(expectedValue);
  } else {
    test.expect(inputValue).not.toBe(expectedValue);
  }
}

export async function writeInput(
  page: Page,
  valueToWrite: string,
  inputIndex: number,
): Promise<void> {
  const input = page.locator("*[data-test=true]").nth(inputIndex);

  await input.evaluate(
    (el, { valueToWrite }) => {
      const inputEl = el as HTMLInputElement;

      inputEl.value = valueToWrite;
      el.dispatchEvent(new Event("change"));
    },
    { valueToWrite },
  );
}
