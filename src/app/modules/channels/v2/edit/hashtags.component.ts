import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TypeaheadInputComponent } from '../../../hashtags/typeahead-input/typeahead-input.component';
import { ChannelEditService } from './edit.service';

@Component({
  selector: 'm-channelEdit__hashtags',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'hashtags.components.html',
})
export class ChannelEditHashtagsComponent {
  /**
   * Typeahead component
   */
  @ViewChild('hashtagsTypeaheadInput', { static: false })
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
