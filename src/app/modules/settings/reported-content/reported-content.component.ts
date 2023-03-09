import { Component } from '@angular/core';

/**
 * Hacky wrapper around the ReportConsoleComponent
 * so it can be used in settings.
 */
@Component({
  moduleId: module.id,
  selector: 'm-settings--reported-content',
  templateUrl: 'reported-content.component.html',
})
export class SettingsReportedContentComponent {}
