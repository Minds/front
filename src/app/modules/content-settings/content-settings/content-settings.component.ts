import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompassService } from '../../compass/compass.service';
import { DiscoveryTagsService } from '../../discovery/tags/tags.service';
import { TagSettingsService } from '../../tag-settings/tag-settings.service';
import {
  ContentSettingsTab,
  ContentSettingsService,
} from '../content-settings.service';

@Component({
  selector: 'm-contentSettings',
  templateUrl: './content-settings.component.html',
  styleUrls: ['./content-settings.component.ng.scss'],
})
export class ContentSettingsComponent implements OnInit, OnDestroy {
  activeTab: ContentSettingsTab;
  private subscriptions: Subscription[] = [];

  constructor(
    public service: ContentSettingsService,
    protected compassService: CompassService,
    protected tagSettingsService: TagSettingsService,
    protected discoveryTagsService: DiscoveryTagsService
  ) {}

  setModalData() {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.activeTab$.subscribe(tab => {
        this.activeTab = tab;
      })
    );
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
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
