import { Component } from '@angular/core';

@Component({
  selector: 'm-discovery__emptyGuestFeedNotice',
  template: `
    <m-notice iconId="explore">
      <span m-notice__title i18n="@@SEARCH__GUEST__EMPTY_NOTICE_TITLE"
        >Be the spark!</span
      >
      <span m-notice__description i18n="@@SEARCH__GUEST__EMPTY_NOTICE_DESC"
        >Seems we're in uncharted territory – there's nothing here... yet! Join
        now and be the first to share your thoughts and stories.</span
      >
      <ng-container m-notice__actions>
        <a routerLink="/register">
          <m-button
            color="blue"
            data-ref="m-discoverySuggestions__copyLinkButton"
          >
            <ng-container i18n="@@SEARCH__GUEST__EMPTY_NOTICE__JOIN_NETWORK"
              >Join network</ng-container
            ></m-button
          ></a
        >
      </ng-container></m-notice
    >
  `,
})
export class DiscoveryEmptyGuestFeedNoticeComponent {}
