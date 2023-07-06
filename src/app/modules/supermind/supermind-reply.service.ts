import { Injectable, Injector, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { first, last, map, take, takeUntil } from 'rxjs/operators';
import { ApiService } from '../../common/api/api.service';
import { ToasterService } from '../../common/services/toaster.service';
import { ComposerModalService } from '../composer/components/modal/modal.service';
import { ComposerService } from '../composer/services/composer.service';
import { ConnectTwitterModalExperimentService } from '../experiments/sub-services/connect-twitter-modal-experiment.service';
import { ConnectTwitterModalService } from '../twitter/modal/connect-twitter-modal.service';
import { TwitterConnectionService } from '../twitter/services/twitter-connection.service';
import { Supermind, SupermindState } from './supermind.types';

/**
 * Service relating to actions of the supermind receiver (replies)
 */
@Injectable()
export class SupermindReplyService implements OnDestroy {
  /**
   * We create a new injector so that there is a new ComposerService
   * for each supermind reply
   */
  protected injector: Injector;

  /**
   * Api in progress state
   */
  public inProgress$$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  // subscription for whether connect twitter modal should be shown before accept.
  public connectTwitterModalSubscription: Subscription;

  /**
   *
   * @param composerModal
   * @param parentInjector
   * @param apiService
   * @param toasterService
   */
  constructor(
    private composerModal: ComposerModalService,
    private twitterConnection: TwitterConnectionService,
    private connectTwitterModal: ConnectTwitterModalService,
    private connectTwitterExperiment: ConnectTwitterModalExperimentService,
    private parentInjector: Injector,
    private apiService: ApiService,
    private toasterService: ToasterService
  ) {
    this.injector = Injector.create({
      providers: [{ provide: ComposerService, useClass: ComposerService }],
      parent: this.parentInjector,
    });
  }

  ngOnDestroy(): void {
    this.connectTwitterModalSubscription?.unsubscribe();
  }

  /**
   * Grab the ComposerService from our new injector
   */
  get composerService(): ComposerService {
    return this.injector.get(ComposerService);
  }

  /**
   * Start the reply. This will open and pass context to the composer.
   * If a Twitter reply is required and Twitter is NOT connected, will instead
   * show ConnectTwitterModal.
   * @param { Supermind } supermindEntity - supermind.
   * @returns { Promise<void> }
   */
  async startReply(supermindEntity: Supermind): Promise<void> {
    this.inProgress$$.next(true);

    const showConnectTwitterModal = await this.showConnectTwitterModal(
      supermindEntity
    );

    if (showConnectTwitterModal) {
      const modalRef = await this.connectTwitterModal.open({
        contextText: 'Supermind', // only appears in mobile widths
        titleText: $localize`:@@CONNECT_TWITTER_MODAL__TWITTER_PERMISSION:Twitter Permission`,
        bodyText: $localize`:@@CONNECT_TWITTER_MODAL__ACCEPT_SUPERMIND_OFFER_CONNECT_YOUR_TWITTER:To accept this Supermind offer, please connect your Twitter account. This will give Minds permission to repost your response on your behalf, but only when you consent.`,
        onConnect: () => {
          modalRef.close();
          // Try again after succesful connect
          this.startReply(supermindEntity);
        },
      });
      this.inProgress$$.next(false);
      return;
    }

    // Pass the supermind entity to the composer
    this.composerService.supermindReply$.next(supermindEntity);
    // All supermind replies are quote posts
    this.composerService.remind$.next(supermindEntity.entity);

    try {
      await this.composerModal
        .setInjector(this.injector)
        .onPost(activity => {
          supermindEntity.status = SupermindState.ACCEPTED;
          supermindEntity.reply_activity_guid = activity.guid;
        })
        .present();
    } catch (err) {
    } finally {
      this.inProgress$$.next(false);
    }
  }

  /**
   * Will decline a supermind request
   * @param supermindEntity
   */
  async decline(supermindEntity: Supermind): Promise<void> {
    this.inProgress$$.next(true);

    try {
      const response = await this.apiService
        .post('api/v3/supermind/' + supermindEntity.guid + '/reject')
        .toPromise();
      console.log(response);
      supermindEntity.status = SupermindState.REJECTED;
    } catch (err) {
      this.toasterService.error(err.message);
    } finally {
      this.inProgress$$.next(false);
    }
  }

  /**
   * Will revoke a supermind
   * Note: only admins can do this at the moment
   * @param supermindEntity
   */
  async cancel(supermindEntity: Supermind): Promise<void> {
    this.inProgress$$.next(true);
    try {
      await this.apiService
        .delete('api/v3/supermind/' + supermindEntity.guid)
        .toPromise();
      supermindEntity.status = SupermindState.REVOKED;
    } catch (err) {
      console.log(err);
      this.toasterService.error(err?.error.message);
    } finally {
      this.inProgress$$.next(false);
    }
  }

  /**
   * Whether ConnectTwitterModal should show for a given Supermind.
   * @param { Supermind } supermind - Supermind to check for.
   * @returns { Observable<boolean> } true if modal should be shown.
   */
  private async showConnectTwitterModal(
    supermind: Supermind
  ): Promise<boolean> {
    // if Twitter is not required, no need to call for the config.
    if (
      !supermind.twitter_required ||
      !this.connectTwitterExperiment.isActive()
    ) {
      return false;
    }

    return !(await this.twitterConnection.isConnected(false));
  }
}
