import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Session } from "../../../../services/session";

@Component({
  selector: 'm-pro--channel-signup',
  template: `
    <section class="m-ProChannelSignup--hero">

      <div class="m-ProChannelSignup--hero--inner">

        <div class="m-ProChannelSignup--hero--slogans">
          <!-- TODO: this text should be dynamic -->
          <h1>Independent.</h1>
          <h1>Community-owned.</h1>
          <h1>Decentralized News</h1>
        </div>

        <div class="m-ProChannelSignup--signup">
          <minds-form-register (done)="registered()"></minds-form-register>
        </div>

      </div>
      
    </section>
  `
})

export class ProChannelSignupComponent implements OnInit {
  username: string;

  paramsSubscription: Subscription;

  constructor(
    public session: Session,
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

  ngOnInit() {
  }

  registered() {
    this.router.navigate(['pro', this.username]);
  }
}
