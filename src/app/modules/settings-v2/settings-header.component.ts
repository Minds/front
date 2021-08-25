import { Component, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'm-settingsV2__header',
  templateUrl: './settings-header.component.html',
})
export class SettingsV2HeaderComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  @Output('backPress') backPress = new EventEmitter<boolean>();

  /**
   * On go back press, emit backPress output.
   */
  public goBack(): void {
    this.backPress.emit(true);
  }
}
