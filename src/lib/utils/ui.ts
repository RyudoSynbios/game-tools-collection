export function scrollIntoViewIfNecessary(
  parentEl: HTMLElement,
  childEl: HTMLElement,
  bottomAlignement: "center" | "end" = "end",
) {
  if (parentEl && childEl) {
    const parentElBoundaries = parentEl.getBoundingClientRect();

    const childElBoundaries = childEl.getBoundingClientRect();

    const childElY = childElBoundaries.y - parentElBoundaries.y;

    if (childElY < 0) {
      parentEl.scrollTo({
        top: parentEl.scrollTop + childElY,
      });
    } else if (
      childElY + childElBoundaries.height >
      parentElBoundaries.height
    ) {
      if (bottomAlignement === "center") {
        parentEl.scrollTo({
          top:
            childElY -
            parentElBoundaries.height / 2 +
            childElBoundaries.height / 2,
        });
      } else if (bottomAlignement === "end") {
        parentEl.scrollTo({
          top:
            parentEl.scrollTop +
            (childElY - parentElBoundaries.height + childElBoundaries.height),
        });
      }
    }
  }
}
