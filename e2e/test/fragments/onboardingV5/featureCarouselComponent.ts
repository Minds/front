import assert from 'assert';
import { FeatureCarouselDirection } from '../../types/feature-carousel.types';

const { I } = inject();

/**
 * Feature carousel component. - shown in onboarding flow.
 */
class FeatureCarouselComponent {
  // selectors
  private rootSelector: string = 'm-featureCarousel';
  private arrowSelector: string = '.m-featureCarousel__itemSelectorArrow';

  private itemDotSelector: string = '.m-featureCarousel__itemSelectorDot';
  private itemDotClassName: string = 'm-featureCarousel__itemSelectorDot';

  private itemDotInactiveSelector: string =
    '.m-featureCarousel__itemSelectorDot--inactive';
  private itemDotInactiveClassName: string =
    'm-featureCarousel__itemSelectorDot--inactive';

  /**
   * Assert that component is visible.
   * @returns { void }
   */
  public isVisible(): void {
    I.seeElement(this.rootSelector);
  }

  /**
   * Click arrow to move carousel.
   * @param { FeatureCarouselDirection } direction - direction to move.
   * @returns { void }
   */
  public clickArrow(direction: FeatureCarouselDirection): void {
    if (direction === FeatureCarouselDirection.Back) {
      I.click(locate(this.arrowSelector).withText('arrow_back'));
    } else {
      I.click(locate(this.arrowSelector).withText('arrow_forward'));
    }
  }

  /**
   * Whether dot at index is active.
   * @param { number } index - index of dot to check.
   * @returns { Promise<void> }
   */
  public async isDotActiveAtIndex(index: number): Promise<void> {
    const classes: string = await I.grabAttributeFrom(
      locate(this.itemDotSelector).at(index + 1),
      'class'
    );

    assert(
      classes.includes(this.itemDotClassName),
      'No dot class is present on dot selector'
    );
    assert(
      !classes.includes(this.itemDotInactiveClassName),
      'Expected dot selector to be inactive'
    );
  }

  /**
   * Click the dot at a given index.
   * @param { number } index - index of dot to click.
   * @returns { void }
   */
  public clickDotAtIndex(index: number): void {
    I.click(locate(this.itemDotSelector).at(index + 1));
  }
}

export = new FeatureCarouselComponent();
