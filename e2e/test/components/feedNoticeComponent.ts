import { FeedNoticeKey } from '../types/feednotice.types';

const { I } = inject();

/**
 * Feed Notice component.
 */
export class FeedNoticeComponent {
  // selectors
  public feedNoticeSelector: string = 'm-feedNotice';
  public feedNoticeTitleSelector: string = '.m-feedNotice__title';
  public feedNoticeBodySelector: string = '.m-feedNotice__body';
  public feedNoticePrimaryActionSelector: string =
    '.m-feedNotice__buttonPrimary button';

  /**
   * Whether feed has a given feed notice.
   * @param { FeedNoticeKey } feedNoticeKey - key to check for.
   * @returns { void }
   */
  public has(feedNoticeKey: FeedNoticeKey): void {
    switch (feedNoticeKey) {
      case 'supermind_pending':
        I.seeElement(this.feedNoticeSelector);
        I.seeElement(
          locate(this.feedNoticeTitleSelector).withText(
            'You have Supermind offers'
          )
        );
        I.seeElement(
          locate(this.feedNoticeBodySelector).withText(
            ' Reply to your fans to claim cash or tokens before your pending offers expire.'
          )
        );
        I.seeElement(
          locate(this.feedNoticePrimaryActionSelector).withText("Let's go")
        );
        break;
      default:
        break;
    }
  }

  /**
   * Click the visible feed notices primary action.
   * @returns { void }
   */
  public clickPrimaryAction(): void {
    I.click(this.feedNoticePrimaryActionSelector);
  }
}
