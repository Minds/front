import { Component } from '@angular/core';
import { NsfwEnabledService } from '../../../../services/nsfw-enabled.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'm-networkAdminConsole__nsfwToggle',
  templateUrl: './nsfw-toggle.component.html',
  styleUrls: [
    './nsfw-toggle.component.ng.scss',
    '../../../stylesheets/console.component.ng.scss',
  ],
})
export class NetworkAdminConsoleNsfwToggleComponent {
  public nsfwToggleVal$: Observable<string> = this.service.nsfwEnabled$.pipe(
    map(value => (value ? 'on' : 'off'))
  );

  constructor(protected service: NsfwEnabledService) {}

  protected toggle($event): void {
    const newValue = $event === 'on';
    this.service.toggle(newValue);
  }
}
