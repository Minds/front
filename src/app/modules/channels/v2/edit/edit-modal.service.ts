import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { ChannelEditComponent } from './edit.component';
import { MindsUser } from '../../../../interfaces/entities';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../../../services/session';

/**
 * Help showing Edit modal and handling its response
 */
@Injectable()
export class ChannelEditModalService {
  /**
   * DI Injector for component tree
   */
  protected injector: Injector;

  /**
   * Constructor
   * @param overlayModal
   */
  constructor(
    protected overlayModal: OverlayModalService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected session: Session
  ) {}

  /**
   * Sets the calling component's injector for DI.
   *
   * @param injector
   */
  setInjector(injector: Injector): ChannelEditModalService {
    this.injector = injector;
    return this;
  }

  /**
   * Presents the channel edit modal with a custom injector tree
   */
  present(channel: MindsUser): Observable<MindsUser | null> {
    if (!this.injector) {
      throw new Error(
        "You need to set the caller component's dependency injector before calling .present()"
      );
    }

    if (channel.guid !== this.session.getLoggedInUser().guid) {
      this.removeQueryParams();
      throw new Error('You may only edit your own channel');
    }

    return new Observable<any>(subscriber => {
      let modalOpen = true;

      try {
        this.overlayModal
          .create(
            ChannelEditComponent,
            channel,
            {
              wrapperClass: 'm-modalV2__wrapper',
              onSave: response => {
                subscriber.next(response);
                this.dismiss();
              },
              onDismissIntent: () => this.dismiss(),
            },
            this.injector
          )
          .onDidDismiss(() => {
            modalOpen = false;
            subscriber.complete();
          })
          .present();
      } catch (e) {
        subscriber.error(e);
      }

      return () => {
        this.injector = void 0;

        if (modalOpen) {
          this.dismiss();
        }
        this.removeQueryParams();
      };
    });
  }

  removeQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        editing: null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  /**
   * Dismisses the modal
   */
  dismiss() {
    this.overlayModal.dismiss();
  }
}
