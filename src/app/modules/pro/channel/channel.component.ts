import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Session } from "../../../services/session";
import { Subscription } from "rxjs";
import { MindsUser } from "../../../interfaces/entities";
import { Client } from "../../../services/api/client";
import { Title } from "@angular/platform-browser";
import { ProService } from "../pro.service";

@Component({
  providers: [
    ProService,
  ],
  selector: 'm-pro--channel',
  templateUrl: 'channel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProChannelComponent implements OnInit, OnDestroy {
  username: string;

  channel: MindsUser;

  inProgress: boolean;

  error: string;

  params$: Subscription;

  constructor(
    protected session: Session,
    protected proService: ProService,
    protected client: Client,
    protected title: Title,
    protected router: Router,
    protected route: ActivatedRoute,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.params$ = this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
      }

      if (this.username && (!this.channel || this.channel.username != this.username)) {
        this.load();
      }
    });
  }

  ngOnDestroy() {
    this.params$.unsubscribe();
  }

  async load() {
    if (!this.username) {
      return;
    }

    this.inProgress = true;
    this.detectChanges();

    try {
      this.channel = await this.proService.load(this.username);

      let title = this.channel.pro_settings.title || this.channel.name;

      if (this.channel.pro_settings.headline) {
        title += ` - ${this.channel.pro_settings.headline}`;
      }

      this.title.setTitle(title);
    } catch (e) {
      this.error = e.getMessage();
    }

    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  @HostBinding('style.backgroundImage') get backgroundImageCssValue() {
    if (!this.channel) {
      return 'none';
    }

    return `url(${this.channel.pro_settings.background_image})`;
  }

  get currentUser() {
    if (!this.session.isLoggedIn()) {
      return null;
    }

    return this.session.getLoggedInUser();
  }
}
