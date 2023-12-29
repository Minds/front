import { Component } from '@angular/core';
import { NsfwEnabledService } from '../../../../services/nsfw-enabled.service';

@Component({
  selector: 'm-networkAdminConsole__nsfwToggle',
  templateUrl: './nsfw-toggle.component.html',
  styleUrls: [
    './nsfw-toggle.component.ng.scss',
    '../../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleNsfwToggleComponent {
  constructor(protected service: NsfwEnabledService) {}
}
