import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Session } from "../../../../services/session";
import { ProChannelService } from "../channel.service";

@Component({
  selector: 'm-pro--channel-login',
  template: `
    <section class="m-ProChannelLogin--hero">

      <div class="m-ProChannelLogin--hero--inner">

        <div class="m-ProChannelLogin--hero--slogans">
          <h2>{{ headline }}</h2>
        </div>

        <div class="m-ProChannelLogin--login">
          <ng-container *ngIf="currentSection === 'login'">
            <span class="m-proChannelLogin--subtext">Not on Minds? <a (click)="currentSection = 'register'">Start a Channel</a></span>
            <minds-form-login (done)="registered()"></minds-form-login>
          </ng-container>
          <ng-container *ngIf="currentSection === 'register'">
            <span class="m-proChannelLogin--subtext"><a (click)="currentSection = 'login'">I already have an account</a></span>
            <minds-form-register (done)="registered()"></minds-form-register>
          </ng-container>
        </div>

      </div>

    </section>
  `
})

export class ProChannelLoginComponent {
  username: string;
  currentSection: 'login' | 'register' = 'login';

  paramsSubscription: Subscription;

  get headline() {
    return this.service.currentChannel.pro_settings.headline || '';
  }

  constructor(
    public session: Session,
    public service: ProChannelService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
      }

      if (this.session.isLoggedIn()) {
        this.router.navigate(this.service.getRouterLink('home'));
      }

    });
  }

  registered() {
    this.router.navigate(this.service.getRouterLink('home'));
  }
}
