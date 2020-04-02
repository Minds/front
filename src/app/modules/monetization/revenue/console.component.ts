import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ChartColumn } from '../../../common/components/chart/chart.component';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'm-revenue--console',
  templateUrl: 'console.component.html',
})
export class RevenueConsoleComponent {
  constructor(
    private client: Client,
    private cd: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    public session: Session
  ) {}

  ngOnInit() {
    if (
      !this.session.getLoggedInUser().merchant ||
      this.session.getLoggedInUser().merchant.deleted
    ) {
      this.router.navigate(['/wallet/usd/onboarding']);
    }
  }
}
