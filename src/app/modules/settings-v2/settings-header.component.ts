import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'm-settingsV2__header',
  templateUrl: './settings-header.component.html',
})
export class SettingsV2HeaderComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route.firstChild });
  }
}
