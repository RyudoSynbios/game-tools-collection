export async function expectInput(
  expectedValue: string,
  inputIndex: number,
  shouldReturn = true,
): Promise<void> {
  const inputsEl = await page.$$("*[data-test=true]");
  const inputEl = inputsEl[inputIndex];

  const inputValue = await page.evaluate(async (el) => {
    switch (el.tagName) {
      case "INPUT":
        return el.value.trim();
      case "SELECT":
        return (
          el.querySelector(`option[value="${el.value}"]`)?.textContent.trim() ||
          ""
        );
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
      el.value = value;
      el.dispatchEvent(new Event("change"));
    },
    inputEl,
    valueToWrite,
  );
}
