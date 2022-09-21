const { I } = inject();

export class NewsfeedPage {
  public newsfeedURI: '/newsfeed/subscriptions/latest';

  get composerBox(): string {
    return `m-newsfeed m-composer .m-composer__trigger`;
  }

  openComposer() {
    I.click(this.composerBox);
  }
}
