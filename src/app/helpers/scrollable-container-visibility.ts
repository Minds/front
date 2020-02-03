// credit to Adam Reis via https://stackoverflow.com/questions/16308037/detect-when-elements-within-a-scrollable-div-are-out-of-view

export default function checkIfElementIsInView(
  container: HTMLElement,
  element: HTMLElement,
  partial?: boolean // if true, returns false if el is partially obscured
) {
  // Determine container top and bottom
  const cTop = container.scrollTop;
  const cBottom = cTop + container.clientHeight;

  // Determine element top and bottom
  const eTop = element.offsetTop;
  const eBottom = eTop + element.clientHeight;

  // Check if in view
  const isTotal = eTop >= cTop && eBottom <= cBottom;
  const isPartial =
    partial &&
    ((eTop < cTop && eBottom > cTop) || (eBottom > cBottom && eTop < cBottom));

  return isTotal || isPartial;
}

export function verticallyScrollToEnsureElementIsInView(
  container: HTMLElement,
  element: HTMLElement,
  smooth?: boolean // true if you want the scroll to be animated
) {
  // Determine container top and bottom
  const cTop = container.scrollTop;
  const cBottom = cTop + container.clientHeight;

  // Determine element top and bottom
  const eTop = element.offsetTop;
  const eBottom = eTop + element.clientHeight;

  // Check if out of view and scroll vertically if it is
  if (smooth) {
    if (eTop < cTop || eBottom > cBottom) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    if (eTop < cTop) {
      container.scrollTop -= cTop - eTop;
    } else if (eBottom > cBottom) {
      container.scrollTop += eBottom - cBottom;
    }
  }
}

export function horizontallyScrollToEnsureElementIsInView(
  container: HTMLElement,
  element: HTMLElement,
  smooth?: boolean // true if you want the scroll to be animated
) {
  // Determine container left and right
  const cLeft = container.scrollLeft;
  const cRight = cLeft + container.clientWidth;

  // Determine element left and right
  const eLeft = element.offsetLeft;
  const eRight = eLeft + element.clientWidth;

  // Check if out of view and scroll horizontally if it is
  if (smooth) {
    if (eLeft < cLeft || eRight > cRight) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else {
    if (eLeft < cLeft) {
      container.scrollLeft -= cLeft - eLeft;
    } else if (eRight > cRight) {
      container.scrollLeft += eRight - cRight;
    }
  }
}
