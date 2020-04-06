import { Component, OnInit } from '@angular/core';
import { FeaturesService } from '../../../services/features.service';

@Component({
  moduleId: module.id,
  selector: 'm-settings--reported-content',
  templateUrl: 'reported-content.component.html',
})
export class SettingsReportedContentComponent implements OnInit {
  hasNewNav: boolean = false;

  constructor(protected featuresService: FeaturesService) {}

  ngOnInit() {
    if (this.featuresService.has('navigation')) {
      this.hasNewNav = true;
    }
  }
}
