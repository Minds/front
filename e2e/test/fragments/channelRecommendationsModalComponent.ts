const { I } = inject();

/**
 * Channel recommendations modal component.
 */
class ChannelRecommendationsModalComponent {
  private modalSelector: string = 'm-channelRecommendationModal';

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

export = new ChannelRecommendationsModalComponent();
