import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompassService } from '../../compass/compass.service';
import { TagSettingsService } from '../../tag-settings/tag-settings.service';
import {
  ContentSettingsModalTab,
  ContentSettingsService,
} from '../content-settings.service';

//ojm todo: open this modal via settings cogs
// ojm to do put behind a feature flag
@Component({
  selector: 'm-contentSettings__modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.ng.scss'],
})
export class ContentSettingsModalComponent implements OnInit, OnDestroy {
  activeTabSubscription: Subscription;
  activeTab: ContentSettingsModalTab;

  constructor(
    public service: ContentSettingsService,
    protected compassService: CompassService,
    protected tagSettingsService: TagSettingsService
  ) {}

  ngOnInit(): void {
    this.activeTabSubscription = this.service.activeTab$.subscribe(tab => {
      this.activeTab = tab;
    });
  }

  ngOnDestroy(): void {
    this.activeTabSubscription.unsubscribe();
  }

  submit(): void {
    switch (this.activeTab) {
      case 'tags':
        this.tagSettingsService.submitRequested$.next(true);
        break;
      case 'compass':
        this.compassService.submitRequested$.next(true);
    }
  }
}
