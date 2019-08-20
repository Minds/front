import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Session } from "../../../../services/session";
import { ProChannelService } from "../channel.service";

@Component({
  selector: 'm-pro--channel-signup',
  template: `
    <section class="m-ProChannelSignup--hero">

      <div class="m-ProChannelSignup--hero--inner">

        <div class="m-ProChannelSignup--hero--slogans">
          <h2>{{ headline }}</h2>
        </div>

        <div class="m-ProChannelSignup--signup">
          <ng-container *ngIf="currentSection === 'login'">
            <span class="m-proChannelSignup--subtext">Not on Minds? <a (click)="currentSection = 'register'">Start a Channel</a></span>
            <minds-form-login (done)="registered()"></minds-form-login>
          </ng-container>
          <ng-container *ngIf="currentSection === 'register'">
            <span class="m-proChannelSignup--subtext"><a (click)="currentSection = 'login'">I already have an account</a></span>
            <minds-form-register (done)="registered()"></minds-form-register>
          </ng-container>
        </div>

      </div>

    </section>
  `
})

export class ProChannelSignupComponent {
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
        this.router.navigate(['/pro', this.username]);
      }

    });
  }

  registered() {
    this.router.navigate(['pro', this.username]);
  }
}
