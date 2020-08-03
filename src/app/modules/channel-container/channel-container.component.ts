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
import { ChannelComponent as ChannelV2Component } from '../channels/v2/channel.component';
import { TRIGGER_EXCEPTION } from '../channels/v2/content/content.service';
import { HeadersService } from '../../common/services/headers.service';

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

  @ViewChild('v1ChannelComponent')
  v1ChannelComponent: ChannelComponent;

  @ViewChild('v2ChannelComponent')
  v2ChannelComponent: ChannelV2Component;

  @ViewChild('proChannelComponent')
  proChannelComponent: ProChannelComponent;

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected client: Client,
    protected session: Session,
    protected site: SiteService,
    protected features: FeaturesService,
    protected headersService: HeadersService
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
    if (this.v1ChannelComponent) {
      return this.v1ChannelComponent.canDeactivate();
    }

    if (this.v2ChannelComponent) {
      return this.v2ChannelComponent.canDeactivate();
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
      this.channel = {
        type: 'user',
        guid: '',
        name: '',
        username: this.username,
        time_created: 0,
        icontime: 0,
        mode: 1,
        nsfw: [],
      };

      this.headersService.setCode(404);

      switch (e.type) {
        case TRIGGER_EXCEPTION.BANNED:
          this.channel.banned = 'yes';
          break;
        case TRIGGER_EXCEPTION.DISABLED:
          this.channel.enabled = 'no';
          // alows users to interact via blocking.
          this.channel.guid = e.guid ? e.guid : null;
          this.channel.blocked = e.blocked;
          break;
        case TRIGGER_EXCEPTION.NOT_FOUND:
          this.channel.not_found = true;
          break;
        default:
          this.error = e.message;
          console.error(e);
      }
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
