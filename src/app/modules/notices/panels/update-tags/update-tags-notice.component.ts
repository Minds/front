import { Component, Injector } from '@angular/core';
import { AbstractSubscriberComponent } from '../../../../common/components/abstract-subscriber/abstract-subscriber.component';
import { ModalService } from '../../../../services/ux/modal.service';
import { ContentSettingsComponent } from '../../../content-settings/content-settings/content-settings.component';
import { FeedNoticeService } from '../../services/feed-notice.service';

/**
 * Update tag preferences notice.
 */
@Component({
  selector: 'm-feedNotice--updateTags',
  templateUrl: 'update-tags-notice.component.html',
})
export class UpdateTagsNoticeComponent extends AbstractSubscriberComponent {
  constructor(
    private feedNotice: FeedNoticeService,
    private modalService: ModalService,
    private injector: Injector
  ) {
    super();
  }

  /**
   * Called on primary option click.
   * @param { MouseEvent } $event - click event.
   * @return { void }
   */
  public onPrimaryOptionClick($event: MouseEvent): void {
    this.modalService.present(ContentSettingsComponent, {
      data: {
        onSave: () => {
          this.modalService.dismissAll();
          this.dismiss();
        },
      },
      injector: this.injector,
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
