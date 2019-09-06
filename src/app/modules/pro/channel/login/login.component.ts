import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Session } from '../../../../services/session';
import { ProChannelService } from '../channel.service';
import { Storage } from '../../../../services/storage';

@Component({
  selector: 'm-pro--channel-login',
  template: `
    <section class="m-ProChannelLogin--hero">
      <div class="m-ProChannelLogin--hero--inner">
        <div class="m-ProChannelLogin--hero--slogans">
          <h2>{{ settings?.headline }}</h2>
        </div>

        <div class="m-ProChannelLogin--login">
          <ng-container *ngIf="currentSection === 'login'">
            <span class="m-proChannelLogin--subtext">
              Not on {{ settings?.title }}?
              <a (click)="currentSection = 'register'">Start a Minds channel</a>
            </span>

            <minds-form-login (done)="registered()"></minds-form-login>
          </ng-container>

          <ng-container *ngIf="currentSection === 'register'">
            <span class="m-proChannelLogin--subtext">
              <a (click)="currentSection = 'login'">
                I already have a Minds account
              </a>
            </span>

            <minds-form-register (done)="registered()"></minds-form-register>
          </ng-container>
        </div>
      </div>
    </section>
  `,
})
export class ProChannelLoginComponent {
  username: string;
  currentSection: 'login' | 'register' = 'login';

  paramsSubscription: Subscription;

  redirectTo: string;

  get settings() {
    return this.service.currentChannel.pro_settings;
  }

  constructor(
    public session: Session,
    public service: ProChannelService,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage
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

  ngOnInit() {
    this.redirectTo = this.storage.get('redirect');
  }

  registered() {
    if (this.redirectTo) {
      this.storage.destroy('redirect');
      this.router.navigate([this.redirectTo]);
      return;
    }

    this.router.navigate(this.service.getRouterLink('home'));
  }
}
