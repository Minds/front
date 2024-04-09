import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PageLayoutService } from '../../../common/layout/page-layout.service';

@Component({
  selector: 'm-forgot-password',
  template: `
    <!--No template - this component redirects -->
  `,
})
export class ForgotPasswordComponent {
  username: string = '';
  code: string = '';
  paramsSubscription: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      let queryParams = { resetPassword: true };

      if (params['username'] && params['code']) {
        queryParams['username'] = params['username'];
        queryParams['code'] = params['code'];
      }

      // Go to homepage and open the reset password modal there
      this.router.navigate(['/'], { queryParams: queryParams });
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
