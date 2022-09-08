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
import { FriendlyCaptchaComponent } from '../../../modules/captcha/friendly-catpcha/friendly-captcha.component';
import { ToasterService } from '../../services/toaster.service';
import { CounterChangeFadeIn } from '../../../animations';

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
   * Will display the friendly captcha component and complete puzzle if true
   */
  public showFriendlyCaptcha = false;

  /**
   * In progress state, eg. captcha working or api saving
   */
  @Input() inProgress = false;

  @Input() iconOnly = false;

  /**
   * Call to let parent functions know a thumb up event has happened
   */
  @Output('thumbsUpChange') thumbsUpChange$: EventEmitter<
    void
  > = new EventEmitter();

  @ViewChild(FriendlyCaptchaComponent)
  friendlyCaptchaEl: FriendlyCaptchaComponent;

  constructor(
    public session: Session,
    public client: Client,
    private authModal: AuthModalService,
    private cd: ChangeDetectorRef,
    private experiments: ExperimentsService,
    private toast: ToasterService
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
    e.stopPropagation();

    if (this.inProgress) {
      return;
    }

    this.inProgress = true;

    if (this.isFriendlyCaptchaFeatureEnabled() && !this.has()) {
      this.showFriendlyCaptcha = true;
    } else {
      this.submit();
    }
  }

  /**
   * Called when friendly captcha returns value
   * @param solution
   */
  onFriendlyCaptchaComplete(solution: string): void {
    this.submit(solution);
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
      if (!user) return;
    }
    let data = {};

    if (this.isFriendlyCaptchaFeatureEnabled()) {
      data = {
        puzzle_solution: solution,
      };
    }

    try {
      let response = await this.client.put(
        'api/v1/thumbs/' + this.object.guid + '/up',
        data
      );
    } catch (e) {
      this.toast.error(e?.message ?? 'An unknown error has occurred');
    }

    this.showFriendlyCaptcha = false;
    this.inProgress = false;

    if (!this.has()) {
      this.object['thumbs:up:user_guids'] = [
        this.session.getLoggedInUser().guid,
      ];
      this.object['thumbs:up:count']++;
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

  public isFriendlyCaptchaFeatureEnabled(): boolean {
    return this.experiments.hasVariation(
      'minds-3119-captcha-for-engagement',
      true
    );
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
}
