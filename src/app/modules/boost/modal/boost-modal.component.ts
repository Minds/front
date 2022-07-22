import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Session } from '../../../services/session';
import {
  BoostModalService,
  BoostSubject,
  BoostTab,
} from './boost-modal.service';

/**
 * Boost modal component. Designed to be lazy loaded in through modal service.
 */
@Component({
  selector: 'm-boostModal',
  templateUrl: './boost-modal.component.html',
  styleUrls: ['./boost-modal.component.ng.scss'],
})
export class BoostModalComponent implements OnInit, OnDestroy {
  /**
   * Asset url
   */
  public readonly cdnAssetsUrl: string;

  constructor(
    private service: BoostModalService,
    private session: Session,
    private toast: ToasterService,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    const entity = this.service.entity$.getValue();

    if (!entity) {
      this.toast.error('An unknown error has occurred.');
      this.onDismissIntent();
      return;
    }

    // if an entity is nsfw, it cannot be boosted - reset and close modal.
    if (entity['nsfw']?.length > 0 || entity['nsfw_lock']?.length > 0) {
      this.toast.error('NSFW content cannot be boosted.');
      this.onDismissIntent();
      return;
    }
  }

  ngOnDestroy(): void {
    this.service.reset();
  }

  /**
   * Entity type from service
   */
  get entityType$(): Observable<BoostSubject> {
    return this.service.entityType$;
  }

  /**
   * Is in progress
   */
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  /**
   * progress should be disabled?
   * @returns { Observable<boolean> } - true if should be disabled.
   */
  get disabled$(): Observable<boolean> {
    return this.service.disabled$;
  }

  /**
   * active tab from service.
   * @returns { BehaviorSubject<BoostTab> } - get currently active tab from service.
   */
  get activeTab$(): BehaviorSubject<BoostTab> {
    return this.service.activeTab$;
  }

  /**
   * Username from session.
   * @returns { string } logged in user username.
   */
  get username(): string {
    return this.session.getLoggedInUser().username;
  }

  /**
   * Dismiss intent.
   */
  onDismissIntent: () => void = () => {};

  /**
   * Save intent.
   */
  onSaveIntent: () => void = () => {};

  /**
   * Observable containing CSS object for banner src
   * @returns { { backgroundImage: string } } - css object intended for consumption by an ngStyle.
   */
  get bannerSrc(): { backgroundImage: string } {
    return {
      backgroundImage: `url('${this.cdnAssetsUrl}assets/photos/red-blue-gradient-banner.jpg')`,
    };
  }

  /**
   * Submits boost and responds on response from server.
   * @returns { Promise<void> } awaitable.
   */
  public async submitBoost(): Promise<void> {
    this.inProgress$.next(true);
    let response;

    try {
      response = await this.service.submitBoostAsync();
    } catch (e) {
      return;
    } finally {
      this.inProgress$.next(false);
    }

    if (
      response &&
      response.status !== undefined &&
      response.status === 'success'
    ) {
      this.toast.success('Success! Your boost request is being processed.');
      this.onSaveIntent();
    }
  }

  /**
   * Sets modal options.
   * @param { Function } onDismissIntent - set dismiss intent callback.
   * @param { Function } onSaveIntent - set save intent callback.
   * @param { BoostableEntity } entity - set entity that is the subject of the boost.
   */
  setModalData({ onDismissIntent, onSaveIntent, entity }) {
    this.onDismissIntent = onDismissIntent || (() => {});
    this.onSaveIntent = onSaveIntent || (() => {});
    this.service.entity$.next(entity || (() => {}));
  }
}
