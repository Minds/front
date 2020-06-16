import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TypeaheadInputComponent } from '../../../hashtags/typeahead-input/typeahead-input.component';
import { ChannelEditService } from './edit.service';

/**
 * Hashtags accordion pane component
 */
@Component({
  selector: 'm-channelEdit__hashtags',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'hashtags.component.html',
})
export class ChannelEditHashtagsComponent {
  /**
   * Typeahead component
   */
  @ViewChild('hashtagsTypeaheadInput')
  protected hashtagsTypeaheadInput: TypeaheadInputComponent;

  /**
   * Constructor
   * @param service
   */
  constructor(public service: ChannelEditService) {}

  /**
   * Intent to add a tag
   * @param hashtag
   */
  addHashtagIntent(hashtag: string) {
    this.service.addHashtag(hashtag);

    if (this.hashtagsTypeaheadInput) {
      this.hashtagsTypeaheadInput.reset();
    }
  }
}
