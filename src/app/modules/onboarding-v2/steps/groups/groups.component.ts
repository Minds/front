import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'm-onboarding__groupsStep',
  templateUrl: 'groups.component.html',
})
export class GroupsStepComponent {
  constructor(private router: Router) {}

  skip() {
    this.router.navigate(['/onboarding', 'channels']);
  }

  continue() {
    this.router.navigate(['/onboarding', 'channels']);
  }
}
