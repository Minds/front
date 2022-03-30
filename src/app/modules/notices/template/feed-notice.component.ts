import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

/**
 * Feeds notices component. To use, provide content via ng-content.
 * Automatic styling inline with the component will be applied for:
 * - (span) .m-feedNotice__title
 * - (p) .m-feedNotice__body
 * - (m-button) .m-feedNotice__buttonPrimary
 * - (m-button) .m-feedNotice__buttonSecondary
 */
@Component({
  selector: 'm-feedNotice',
  templateUrl: 'feed-notice.component.html',
  styleUrls: ['feed-notice.component.ng.scss'],
})
export class FeedNoticeComponent {
  // Whether component is dismissible or not (shows close button).
  @Input() dismissible: boolean = true;

  // Icon to be shown.
  @Input() icon: string = 'info';

  // id to append to data-ref attribute so we know which notice has been dismissed.
  @Input() dataRefId: string = 'unknown';

  // Makes notice to stick to the top of the feed.
  @HostBinding('class.m-feedNotice__container--sticky')
  @Input()
  stickyTop: boolean;

  // Fired on dismiss click.
  @Output() dismissClick: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
}
