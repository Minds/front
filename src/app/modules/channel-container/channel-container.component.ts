import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Client } from '../../services/api/client';
import { MindsUser } from '../../interfaces/entities';
import { MindsChannelResponse } from '../../interfaces/responses';
import { ProChannelComponent } from '../pro/channel/channel.component';
import { Session } from '../../services/session';
import { SiteService } from '../../common/services/site.service';
import { ChannelComponent as ChannelV2Component } from '../channels/v2/channel.component';
import { TRIGGER_EXCEPTION } from '../channels/v2/content/content.service';
import { HeadersService } from '../../common/services/headers.service';
import { AuthModalService } from '../auth/modal/auth-modal.service';
import { isPlatformServer } from '@angular/common';

/**
 * Contains and controls access to to channel pages
 */
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
    protected headersService: HeadersService,
    protected authModal: AuthModalService,
    @Inject(PLATFORM_ID) private platformId: Object
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

      // disabled for https://gitlab.com/minds/front/-/issues/4379
      const shouldRedirectToProHandler = false;
      // this.showPro &&
      // !this.site.isProDomain &&
      // this.channel.pro_published &&
      // !this.isOwner &&
      // !this.isAdmin &&
      // this.proEnabled;

      // NOTE: Temporary workaround until channel component supports children routes
      if (shouldRedirectToProHandler) {
        this.router.navigate(['/pro', this.channel.username], {
          replaceUrl: true,
        });
      }

      // Note: we don't throw an exception as we do want og:title etc to still work
      if (response.require_login) {
        this.headersService.setCode(401);
        this.channel.require_login = true;
        await this.openLoginModal();
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

  async openLoginModal(): Promise<void> {
    if (isPlatformServer(this.platformId)) return;
    const user = await this.authModal.open();
    if (user) {
      this.load();
    }
  }

  get isOwner() {
    const currentUser = this.session.getLoggedInUser();
    return this.channel && currentUser && this.channel.guid == currentUser.guid;
  }

  get isAdmin() {
    return this.session.isAdmin();
  }

  get proEnabled() {
    // disabled for https://gitlab.com/minds/front/-/issues/4379
    return false;
  }
}
