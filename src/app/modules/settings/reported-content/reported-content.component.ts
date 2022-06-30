import { Component, OnInit } from '@angular/core';
import { FeaturesService } from '../../../services/features.service';

/**
 * Hacky wrapper around the ReportConsoleComponent
 * so it can be used in settings.
 */
@Component({
  moduleId: module.id,
  selector: 'm-settings--reported-content',
  templateUrl: 'reported-content.component.html',
})
export class SettingsReportedContentComponent implements OnInit {
  hasNewNav: boolean = false;

  constructor(protected featuresService: FeaturesService) {}

  ngOnInit() {
    this.hasNewNav = true;
  }
}
