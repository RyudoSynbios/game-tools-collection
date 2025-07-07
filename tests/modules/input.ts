export async function expectInput(
  expectedValue: string,
  inputIndex: number,
  shouldReturn = true,
): Promise<void> {
  await page.waitForSelector(".gtc-content");

  const inputsEl = await page.$$("*[data-test=true]");
  const inputEl = inputsEl[inputIndex];

  const inputValue = await page.evaluate(async (el) => {
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
  }, inputEl);

  if (shouldReturn) {
    expect(inputValue).toBe(expectedValue);
  } else {
    expect(inputValue).not.toBe(expectedValue);
  }
}

export async function writeInput(
  valueToWrite: string,
  inputIndex: number,
): Promise<void> {
  const inputsEl = await page.$$("*[data-test=true]");
  const inputEl = inputsEl[inputIndex];

  await page.evaluate(
    (el, value) => {
      const inputEl = el as HTMLInputElement;

      inputEl.value = value;
      inputEl.dispatchEvent(new Event("change"));
    },
    inputEl,
    valueToWrite,
  );
}
