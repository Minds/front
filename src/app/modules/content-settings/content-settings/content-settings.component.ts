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

  /** @type { boolean } whether compass tab should be hidden */
  public hideCompass: boolean = false;

  /** @type { boolean } whether the modal is being shown during onboarding */
  public isOnboarding: boolean = false;

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
   * @param {{ boolean }} hideCompass - whether compass options should be shown.
   * @param {{ boolean }} isOnboarding - whether modal is being shown during onboarding
   * @returns { void }
   */
  setModalData({ onSave, hideCompass = false, isOnboarding = false }): void {
    this.onSaveIntent = onSave || noOp;
    this.hideCompass = hideCompass ?? false;
    this.isOnboarding = isOnboarding ?? false;

    // Onboarding only uses the tags tab
    if (this.isOnboarding) {
      this.hideCompass = true;
    }
  }

  getModalOptions() {
    return {
      canDismiss: async () => {
        // Hashtag selection is mandatory for onboarding
        return !this.isOnboarding;
      },
    };
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.service.activeTab$.subscribe((tab) => {
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
