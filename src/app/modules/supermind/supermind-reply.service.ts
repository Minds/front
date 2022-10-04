import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../../common/api/api.service';
import { ToasterService } from '../../common/services/toaster.service';
import { ComposerModalService } from '../composer/components/modal/modal.service';
import { ComposerService } from '../composer/services/composer.service';
import { Supermind, SupermindState } from './supermind.types';

/**
 * Service relating to actions of the supermind receiver (replies)
 */
@Injectable()
export class SupermindReplyService {
  /**
   * We create a new injector so that there is a new ComposerService
   * for each supermind reply
   */
  protected injector: Injector;

  /**
   * Api in progress state
   */
  public inProgress$$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   *
   * @param composerModal
   * @param parentInjector
   * @param apiService
   * @param toasterService
   */
  constructor(
    private composerModal: ComposerModalService,
    private parentInjector: Injector,
    private apiService: ApiService,
    private toasterService: ToasterService
  ) {
    this.injector = Injector.create({
      providers: [{ provide: ComposerService, useClass: ComposerService }],
      parent: this.parentInjector,
    });
  }

  /**
   * Grab the ComposerService from our new injector
   */
  get composerService(): ComposerService {
    return this.injector.get(ComposerService);
  }

  /**
   * Start the reply. This will open and pass context to the composer
   */
  async startReply(supermindEntity: Supermind): Promise<void> {
    this.inProgress$$.next(true);

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
}
