import { Component } from '@angular/core';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ContentSettingsModalService } from '../../../content-settings/content-settings-modal.service';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Update tag preferences notice. Allows a user to open the content settings
 * modal to add or update their tags.
 */
@Component({
  selector: 'm-feedNotice--updateTags',
  templateUrl: 'update-tags-notice.component.html',
})
export class UpdateTagsNoticeComponent extends AbstractSubscriberComponent {
  constructor(
    private feedNotice: FeedNoticeService,
    private contentSettingsModal: ContentSettingsModalService
  ) {
    super();
  }

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public onPrimaryOptionClick($event: MouseEvent): void {
    this.contentSettingsModal.open({
      hideCompass: true,
      onSave: () => {
        this.contentSettingsModal.dismiss();
      },
    });
  }

  /**
   * Dismiss notice.
   * @return { void }
   */
  public dismiss(): void {
    this.feedNotice.dismiss('update-tags');
  }
}
