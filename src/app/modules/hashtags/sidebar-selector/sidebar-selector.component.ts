import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { TopbarHashtagsService } from "../service/topbar.service";
import { Tag } from "../types/tag";

export type SideBarSelectorChange = { type: string, timestamp?: number, value?: any };

@Component({
  selector: 'm-hashtags--sidebar-selector',
  templateUrl: 'sidebar-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarSelectorComponent implements OnInit {
  @Input() disabled: boolean;
  @Input() preferred: boolean = true;
  @Input() showAtLeast: number = 5;
  @Input() currentHashtag: string;
  @Output() filterChange: EventEmitter<SideBarSelectorChange> = new EventEmitter<SideBarSelectorChange>();

  hashtags: Tag[] = [];
  showAll: boolean = false;
  loading: boolean;

  protected lastPreferredEmission: boolean;

  constructor(
    protected topbarHashtagsService: TopbarHashtagsService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.lastPreferredEmission = this.preferred;
    this.load();
  }

  async load() {
    this.loading = true;
    this.detectChanges();

    try {
      this.hashtags = await this.topbarHashtagsService.loadAll({
        softLimit: 20,
        trending: true,
        defaults: true,
      });
    } catch (e) {
      console.error('SidebarSelector', e);
    }

    this.loading = false;
    this.detectChanges();
  }

  calcFoldLength() {
    // Ensure user hashtags are always shown; checks the first non-user and uses index as size
    const userLength = this.hashtags.findIndex(hashtag => hashtag.type !== 'user');

    // Ensure selected hashtags are always shown; checks the first non-selected and uses index + 5
    const selectedLength = this.hashtags.findIndex(hashtag => !hashtag.selected) + 5;

    // Ensure current hashtag position is always shown; uses index + 1 as size; only when not disabled
    const currentSelectedLength = !this.disabled ?
      this.hashtags.findIndex(hashtag => hashtag.value === this.currentHashtag) + 1 :
      -1;

    // Return the largest
    return Math.max(this.showAtLeast, userLength, selectedLength, currentSelectedLength);
  }

  get visibleHashtags() {
    if (!this.showAll) {
      return this.hashtags.slice(0, this.calcFoldLength());
    }

    return this.hashtags;
  }

  get hasBelowTheFoldHashtags() {
    return this.hashtags.length > this.calcFoldLength();
  }

  hashtagVisibilityChange(hashtag) {
    if (this.currentHashtag !== hashtag.value) {
      this.currentHashtag = hashtag.value;

      this.filterChange.emit({
        type: 'single',
        value: this.currentHashtag,
      });
    } else {
      this.currentHashtag = null;
      this.preferred = this.lastPreferredEmission;

      this.preferredChange();
    }
  }

  preferredChange() {
    this.lastPreferredEmission = this.preferred;

    this.filterChange.emit({
      type: this.preferred ? 'preferred' : 'all',
      timestamp: this.preferred ? Date.now() : null,
    });
  }

  toggleShowAll() {
    this.showAll = !this.showAll;
  }

  addHashtag(htmlInputElement: HTMLInputElement) {
    const hashtagValue = htmlInputElement.value;

    this.resetAddHashtag(htmlInputElement);
    this.detectChanges();

    if (hashtagValue) {
      let hashtag: Tag = {
        value: this.topbarHashtagsService.cleanupHashtag(hashtagValue.toLowerCase()),
        selected: false,
      };

      this.hashtags.push(hashtag);
      this.detectChanges();

      this.toggleHashtag(hashtag);
    }
  }

  resetAddHashtag(htmlInputElement: HTMLInputElement) {
    htmlInputElement.value = '';
  }

  async toggleHashtag(hashtag) {
    try {
      await this.topbarHashtagsService.toggleSelection(hashtag, this);
      this.hashtags = this.hashtags.sort(this.topbarHashtagsService._sortHashtags);
    } catch (e) {
      console.error('SidebarSelector', e);
      hashtag.selected = !hashtag.selected;
    }

    this.detectChanges();

    this.preferredChange();
  }

  detectChanges() {
    this.changeDetectorRef.markForCheck();
    this.changeDetectorRef.detectChanges();
  }
}
