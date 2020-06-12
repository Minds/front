import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { TypeaheadInputComponent } from '../../../../../hashtags/typeahead-input/typeahead-input.component';
import { GroupEditService } from '../edit.service';

@Component({
  selector: 'm-groupEdit__hashtags',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'hashtags.component.html',
})
export class GroupEditHashtagsComponent {
  /**
   * Typeahead component
   */
  @ViewChild('hashtagsTypeaheadInput')
  protected hashtagsTypeaheadInput: TypeaheadInputComponent;

  /**
   * Constructor
   * @param service
   */
  constructor(public service: GroupEditService) {}

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
