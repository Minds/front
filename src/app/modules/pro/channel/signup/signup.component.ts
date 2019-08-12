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
          <minds-form-register (done)="registered()"></minds-form-register>
        </div>

      </div>

    </section>
  `
})

export class ProChannelSignupComponent {
  username: string;

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

      this.service.setChildParams(params);
    });
  }

  registered() {
    this.router.navigate(['pro', this.username]);
  }
}
