import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Tag } from '../onboarding-panel.service';
import { OnboardingV3TagsService } from './tags.service';

@Component({
  selector: 'm-onboardingV3__tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.ng.scss'],
})
export class OnboardingV3TagsComponent implements OnInit {
  constructor(private service: OnboardingV3TagsService) {}

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
