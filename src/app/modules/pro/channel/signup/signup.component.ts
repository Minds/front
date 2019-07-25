import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Session } from "../../../../services/session";

@Component({
  selector: 'm-pro--channel-signup',
  template: `
    <div class="m-ProChannelSignup__Text">
      <!-- TODO: this text should be dynamic -->
      <h2>Independent.</h2>
      <h2>Community-owned.</h2>
      <h2>Decentralized News</h2>
    </div>
    <div class="m-ProChannelSignup__SignupForm">
      <minds-form-register (done)="registered()"></minds-form-register>
    </div>
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
