import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';

import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { AuthModalService } from '../../../modules/auth/modal/auth-modal.service';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';
import { ToasterService } from '../../services/toaster.service';
import { CounterChangeFadeIn } from '../../../animations';
import { ClientMetaDirective } from '../../directives/client-meta.directive';
import { IsTenantService } from '../../services/is-tenant.service';
import { PermissionIntentsService } from '../../services/permission-intents.service';
import { PermissionsEnum } from '../../../../graphql/generated.engine';

@Component({
  selector: 'minds-button-thumbs-up',
  inputs: ['_object: object'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'thumbs-up.component.html',
  styleUrls: [`thumbs-up.component.ng.scss`],
  animations: [CounterChangeFadeIn],
})
export class ThumbsUpButton implements DoCheck, OnChanges {
  changesDetected: boolean = false;
  object = {
    guid: null,
    owner_guid: null,
    'thumbs:up:user_guids': [],
  };

  /**
   * In progress state, eg. captcha working or api saving
   */
  @Input() inProgress = false;

  @Input() iconOnly = false;

  /**
   * When true, display a bordered button with "see more of this" text
   */
  @Input() explicit = false;

  /**
   * Call to let parent functions know a thumb up event has happened
   */
  @Output('thumbsUpChange') thumbsUpChange$: EventEmitter<void> =
    new EventEmitter();

  @ViewChild(ClientMetaDirective) clientMeta: ClientMetaDirective;

  constructor(
    public session: Session,
    public client: Client,
    private authModal: AuthModalService,
    private cd: ChangeDetectorRef,
    private experiments: ExperimentsService,
    private toast: ToasterService,
    private isTenant: IsTenantService,
    private permissionIntents: PermissionIntentsService
  ) {}

  set _object(value: any) {
    if (!value) return;
    this.object = value;
    if (!this.object['thumbs:up:user_guids'])
      this.object['thumbs:up:user_guids'] = [];
  }

  /**
   * Called when a mouse click / tap is made
   * @param e
   * @returns void
   */
  onClick(e: MouseEvent): void {
    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    this.submit();
  }

  /**
   * Submits the vote (or cancels it)
   * @param solution
   * @returns Promise<void>
   */
  async submit(solution?: string): Promise<void> {
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

    let data = {
      client_meta: this.clientMeta.build({
        campaign: this.object['urn'],
      }),
    };

    try {
      let response = await this.client.put(
        'api/v1/thumbs/' + this.object.guid + '/up',
        data
      );
    } catch (e) {
      this.toast.error(e?.message ?? 'An unknown error has occurred');
    }

    this.inProgress = false;

    if (!this.has()) {
      this.object['thumbs:up:user_guids'] = [
        this.session.getLoggedInUser().guid,
      ];
      this.object['thumbs:up:count']++;
      this.showImproveRecsToast();
    } else {
      for (let key in this.object['thumbs:up:user_guids']) {
        if (
          this.object['thumbs:up:user_guids'][key] ===
          this.session.getLoggedInUser().guid
        )
          delete this.object['thumbs:up:user_guids'][key];
      }
      this.object['thumbs:up:count']--;
    }

    this.cd.detectChanges();

    this.thumbsUpChange$.next();
  }

  /**
   * Returns if the current user has voted up
   * @returns boolean
   */
  has(): boolean {
    for (var guid of this.object['thumbs:up:user_guids']) {
      if (guid === this.session.getLoggedInUser().guid) return true;
    }
    return false;
  }

  ngOnChanges(changes) {}

  ngDoCheck() {
    this.changesDetected = false;
    if (this.object['thumbs:up:count'] != this.object['thumbs:up:count:old']) {
      this.object['thumbs:up:count:old'] = this.object['thumbs:up:count'];
      this.changesDetected = true;
    }

    if (this.changesDetected) {
      this.cd.detectChanges();
    }
  }

  /**
   * Show improve recommendations toast message if appropriate.
   * @returns { void }
   */
  private showImproveRecsToast(): void {
    if (
      // don't show for tenants
      !this.isTenant.is() &&
      // don't show for comments.
      this.object['type'] !== 'comment' &&
      // only show if has not already been shown this session.
      !Boolean(localStorage.getItem('improve_recs_toast_shown'))
    ) {
      this.toast.success(
        'Thank you! We use this to improve your recommendations.'
      );
      localStorage.setItem('improve_recs_toast_shown', '1');
    }
  }
}
