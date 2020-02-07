// credit to Adam Reis via https://stackoverflow.com/questions/16308037/detect-when-elements-within-a-scrollable-div-are-out-of-view

export default function isElementVerticallyInView(
  container: HTMLElement,
  element: HTMLElement,
  partial?: boolean // if true, returns false if el is partially obscured
) {
  if (container && element) {
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
      ((eTop < cTop && eBottom > cTop) ||
        (eBottom > cBottom && eTop < cBottom));

    return isTotal || isPartial;
  }
}

export function isElementHorizontallyInView(
  container: HTMLElement,
  element: HTMLElement,
  partial?: boolean // if true, returns false if el is partially obscured
) {
  if (container && element) {
    // Determine container left and right
    const cLeft = container.scrollLeft;
    const cRight = cLeft + container.clientWidth;

    // Determine element left and right
    const eLeft = element.offsetLeft;
    const eRight = eLeft + element.clientWidth;

    // Check if in view
    const isTotal = eLeft >= cLeft && eRight <= cRight;
    const isPartial =
      partial &&
      ((eLeft < cLeft && eRight > cLeft) ||
        (eRight > cRight && eLeft < cRight));

    return isTotal || isPartial;
  }
  return false;
}

export function verticallyScrollElementIntoView(
  container: HTMLElement,
  element: HTMLElement,
  smooth?: boolean // true if you want the scroll to be animated
) {
  if (container && element) {
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
}

export function horizontallyScrollElementIntoView(
  container: HTMLElement,
  element: HTMLElement,
  smooth?: boolean // true if you want the scroll to be animated
) {
  if (container && element) {
    // Determine container left and right
    const cLeft = container.scrollLeft;
    const cRight = cLeft + container.clientWidth;

    // Determine element left and right
    const eLeft = element.offsetLeft;
    const eRight = eLeft + element.clientWidth;

    let targetScrollLeft;

    if (eLeft < cLeft || (eLeft < cLeft && eRight > cLeft)) {
      // wholly or partially obscured on left
      targetScrollLeft = container.scrollLeft - cLeft - eLeft;
    } else if (eRight > cRight || (eRight > cRight && eLeft < cRight)) {
      // wholly or partially obscured on right
      targetScrollLeft = container.scrollLeft + eRight - cRight;
    }

    if (smooth) {
      const opts: ScrollToOptions = {
        top: 0,
        left: targetScrollLeft,
        behavior: 'smooth',
      };
      container.scrollTo(opts);
    } else {
      container.scrollLeft = targetScrollLeft;
    }
  }
}
