import { Component, OnInit } from '@angular/core';
import _ from 'highlight.js/lib/languages/*';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Tag } from '../onboarding-panel.service';
import { OnboardingV3PanelService } from '../onboarding-panel.service';

@Component({
  selector: 'm-onboardingV3__tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.ng.scss'],
})
export class OnboardingV3TagsComponent {
  constructor(private service: OnboardingV3PanelService) {}

  ngOnInit() {
    this.service.loadTags();
  }

  get tags$(): BehaviorSubject<Tag[]> {
    return this.service.tags$;
  }

  toggleTag(tagValue: string): void {
    this.service.toggleTag(tagValue);
  }
}
