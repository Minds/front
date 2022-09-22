const { I } = inject();

export class NewsfeedPage {
  public newsfeedURI: string = '/newsfeed/subscriptions/latest';

  get composerBox(): string {
    return `m-newsfeed m-composer .m-composer__trigger`;
  }

  openComposer() {
    I.waitForElement(this.composerBox, 5);
    I.click(this.composerBox);
  }
}
