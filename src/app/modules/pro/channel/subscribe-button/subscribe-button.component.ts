import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Injector,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../../../services/session';
import { SiteService } from '../../../../common/services/site.service';
import { ProChannelService } from '../channel.service';
import { ProUnsubscribeModalComponent } from '../unsubscribe-modal/modal.component';
import { MindsUser } from '../../../../interfaces/entities';
import { Subscription } from 'rxjs';
import { ModalService } from '../../../../services/ux/modal.service';

@Component({
  selector: 'm-pro__subscribeButton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'subscribe-button.component.html',
})
export class SubscribeButtonComponent implements OnInit, OnDestroy {
  @Output() onAction: EventEmitter<any> = new EventEmitter<any>();

  count: number;

  subscribed: boolean;

  protected loggedIn$: Subscription;

  protected channelChange$: Subscription;

  constructor(
    protected session: Session,
    protected router: Router,
    protected site: SiteService,
    protected channelService: ProChannelService,
    protected modalService: ModalService,
    protected injector: Injector,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.updateCount();

    this.channelChange$ = this.channelService.onChannelChange.subscribe(() => {
      this.updateCount();
    });

    this.loggedIn$ = this.session.loggedinEmitter.subscribe(is => {
      if (!is) {
        this.subscribed = false;
        this.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    this.loggedIn$.unsubscribe();
    this.channelChange$.unsubscribe();
  }

  async toggleSubscription() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(
        this.site.isProDomain
          ? this.channelService.getRouterLink('login')
          : ['/login']
      );
    } else if (!this.channel.subscribed) {
      await this.channelService.subscribe();
      this.updateCount();
    } else {
      await this.modalService.present(ProUnsubscribeModalComponent, {
        modalDialogClass: 'm-overlayModal--unsubscribe',
        injector: this.injector,
      }).result;
      this.updateCount();
    }

    this.onAction.emit();
  }

  updateCount() {
    this.subscribed = this.channel.subscribed;
    this.count = this.channel.subscribers_count;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get channel(): MindsUser {
    return this.channelService.currentChannel;
  }
}
