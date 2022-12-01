import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Session } from '../../../services/session';
import { BoostModalService } from './boost-modal.service';
import { BoostSubject, BoostTab } from './boost-modal.types';

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

  // Is in progress.
  public readonly inProgress$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // Entity type from service
  public entityType$: Observable<BoostSubject> = this.service.entityType$;

  // Progress should be disabled?
  public disabled$: Observable<boolean> = this.service.disabled$;

  // Active tab from service.
  public activeTab$: BehaviorSubject<BoostTab> = this.service.activeTab$;

  // Username from session.
  public username: string = this.session.getLoggedInUser().username ?? null;

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
    let response;

    if (
      this.service.activeTab$.getValue() === 'cash' &&
      !this.service.cashRefundPolicy$.getValue()
    ) {
      this.toast.error('You must accept the cash boost refund policy first');
      return;
    }

    this.inProgress$.next(true);

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
    this.service.cashRefundPolicy$.next(false); // reset every time
  }
}
