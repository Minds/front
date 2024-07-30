import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { ToasterService } from '../../services/toaster.service';
import { PermissionIntentsService } from '../../services/permission-intents.service';
import { PermissionsEnum } from '../../../../graphql/generated.engine';

@Component({
  selector: 'minds-button-thumbs-down',
  inputs: ['_object: object'],
  templateUrl: 'thumbs-down.component.html',
  styleUrls: [`thumbs-up.component.ng.scss`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThumbsDownButton {
  changesDetected: boolean = false;
  object;

  /** @type { boolean } whether request is inProgress. */
  public inProgress: boolean = false;

  /**
   * When true, display a bordered button with "see more of this" text
   */
  @Input() explicit = false;

  /**
   * Call to let parent functions know a thumb down event has happened
   * Emits true if a downvote was added
   * and false if a downvote was removed
   */
  @Output('thumbsDownChange') thumbsDownChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(
    private cd: ChangeDetectorRef,
    public session: Session,
    public client: Client,
    private authModal: AuthModalService,
    private toast: ToasterService,
    private permissionIntents: PermissionIntentsService
  ) {}

  set _object(value: any) {
    this.object = value;
    if (!this.object['thumbs:down:user_guids'])
      this.object['thumbs:down:user_guids'] = [];
  }

  async thumb(): Promise<void> {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;
    this.cd.detectChanges();
    if (!this.session.isLoggedIn()) {
      const user = await this.authModal.open();
      if (!user) {
        this.inProgress = false;
        return;
      }
    }

    if (
      !this.permissionIntents.checkAndHandleAction(PermissionsEnum.CanInteract)
    ) {
      this.inProgress = false;
      return;
    }

    try {
      await this.client.put('api/v1/thumbs/' + this.object.guid + '/down', {});
    } catch (e) {
      this.toast.error(e?.message ?? 'An unknown error has occurred');
    }

    this.inProgress = false;

    let downvoteAdded = false;

    if (!this.userHasDownvoted()) {
      this.object['thumbs:down:user_guids'] = [
        this.session.getLoggedInUser().guid,
      ];
      downvoteAdded = true;
    } else {
      for (let key in this.object['thumbs:down:user_guids']) {
        if (
          this.object['thumbs:down:user_guids'][key] ===
          this.session.getLoggedInUser().guid
        )
          delete this.object['thumbs:down:user_guids'][key];
      }
    }

    this.thumbsDownChange.emit(downvoteAdded);

    this.cd.detectChanges();
  }

  userHasDownvoted() {
    for (var guid of this.object['thumbs:down:user_guids']) {
      if (guid === this.session.getLoggedInUser().guid) return true;
    }
    return false;
  }
}
