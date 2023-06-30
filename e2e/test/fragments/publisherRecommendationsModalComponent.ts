const { I } = inject();

/**
 * Publisher recommendations modal component.
 */
class PublisherRecommendationsModalComponent {
  private modalSelector: string = 'm-publisherRecommendationsModal';

  /**
   * Click skip button.
   * @returns { void }
   */
  public skip(): void {
    I.click(
      locate('button')
        .inside(this.modalSelector)
        .withText('Skip')
    );
  }
}

export = new PublisherRecommendationsModalComponent();
