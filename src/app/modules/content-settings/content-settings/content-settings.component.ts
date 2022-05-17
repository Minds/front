import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CompassService } from '../../compass/compass.service';
import { DiscoveryTagsService } from '../../discovery/tags/tags.service';
import { TagSettingsService } from '../../tag-settings/tag-settings.service';
import noOp from '../../../helpers/no-op';
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

  /**
   * Called on save.
   */
  private onSaveIntent: () => void = noOp;

  /**
   * Set modal data
   * @param {{ function }} onSave - function to be called on save.
   * @returns { void }
   */
  setModalData({ onSave }): void {
    this.onSaveIntent = onSave || noOp;
  }

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

  /**
   * Called on submit action.
   * @returns { void }
   */
  submit(): void {
    switch (this.activeTab) {
      case 'tags':
        this.tagSettingsService.submitRequested$.next(true);
        break;
      case 'compass':
        this.compassService.submitRequested$.next(true);
    }
    this.onSaveIntent();
  }
}
