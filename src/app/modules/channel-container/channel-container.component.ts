import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Client } from '../../services/api/client';
import { MindsUser } from '../../interfaces/entities';
import { MindsChannelResponse } from '../../interfaces/responses';
import { ChannelComponent } from '../channels/channel.component';
import { ProChannelComponent } from '../pro/channel/channel.component';
import { Session } from '../../services/session';
import { SiteService } from '../../common/services/site.service';
import { FeaturesService } from '../../services/features.service';

@Component({
  selector: 'm-channel-container',
  templateUrl: 'channel-container.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ChannelContainerComponent implements OnInit, OnDestroy {
  inProgress: boolean = false;
  error: string;

  channel: MindsUser;

  protected username: string;
  protected showPro: boolean;

  protected param$: Subscription;

  @ViewChild('channelComponent', { static: false })
  channelComponent: ChannelComponent;

  @ViewChild('proChannelComponent', { static: false })
  proChannelComponent: ProChannelComponent;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected client: Client,
    protected session: Session,
    protected site: SiteService,
    protected features: FeaturesService
  ) {}

  ngOnInit(): void {
    this.param$ = this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
        this.showPro = !params['pro'] || params['pro'] !== '0';

        if (
          this.username &&
          (!this.channel || this.channel.username !== this.username)
        ) {
          this.load();
        }
      }
    });
  }

  canDeactivate(): boolean | Observable<boolean> {
    if (this.channelComponent) {
      return this.channelComponent.canDeactivate();
    }

    return true;
  }

  ngOnDestroy(): void {
    this.param$.unsubscribe();
  }

  async load() {
    if (!this.username || this.showPro === undefined) {
      return;
    }

    this.inProgress = true;

    try {
      const response: MindsChannelResponse = (await this.client.get(
        `api/v1/channel/${this.username}`
      )) as MindsChannelResponse;

      this.channel = response.channel;

      const shouldRedirectToProHandler =
        this.showPro &&
        !this.site.isProDomain &&
        this.channel.pro_published &&
        !this.isOwner &&
        !this.isAdmin &&
        this.proEnabled;

      // NOTE: Temporary workaround until channel component supports children routes
      if (shouldRedirectToProHandler) {
        this.router.navigate(['/pro', this.channel.username], {
          replaceUrl: true,
        });
      }
    } catch (e) {
      this.error = e.message;
      console.error(e);
    }

    this.inProgress = false;
  }

  get isOwner() {
    const currentUser = this.session.getLoggedInUser();
    return this.channel && currentUser && this.channel.guid == currentUser.guid;
  }

  get isAdmin() {
    return this.session.isAdmin();
  }

  get proEnabled() {
    return this.features.has('pro');
  }
}
