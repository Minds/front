import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  HostListener,
  ViewChild,
} from '@angular/core';

import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { HashtagsSelectorModalComponent } from '../hashtag-selector-modal/hashtags-selector.component';
import { TopbarHashtagsService } from '../service/topbar.service';
import { DropdownComponent } from '../../../common/components/dropdown/dropdown.component';
import { Tag } from '../types/tag';

@Component({
  selector: 'm-hashtags--topbar-selector',
  templateUrl: 'topbar-selector.component.html',
})
export class HashtagsTopbarSelectorComponent implements OnInit {
  @Input() enabled: boolean = true;
  @Output() selectionChange: EventEmitter<string | null> = new EventEmitter<
    string | null
  >();

  hashtags: Tag[] = [];
  selectedHashtag: string | null = null;
  all: boolean = false;
  showMenu: boolean = false;

  @ViewChild('dropdown', { static: false }) dropdown: DropdownComponent;

  constructor(
    public overlayModal: OverlayModalService,
    public topbarHashtagsService: TopbarHashtagsService
  ) {}

  @Input('selected') set _selected(hashtag: string) {
    if (this.selectedHashtag === hashtag) {
      return;
    }

    this.selectedHashtag = hashtag || null;
  }

  async ngOnInit() {
    await this.load();
    this.detectWidth();
  }

  async load() {
    try {
      this.hashtags = await this.topbarHashtagsService.load(5, {
        defaults: true,
      });
    } catch (e) {
      console.error(e);
    }
  }

  toggleAll() {
    if (this.dropdown) {
      this.dropdown.toggle();
    }

    this.all = !this.all;
    this.emit();
  }

  async setHashtag(hashtag: Tag) {
    if (this.dropdown) {
      this.dropdown.toggle();
    }

    if (this.all) {
      this.all = false;
    }

    this.selectedHashtag = hashtag.value;
    this.emit();
  }

  emit() {
    this.selectionChange.emit(this.all ? null : this.selectedHashtag);
  }

  openModal() {
    if (this.dropdown) {
      this.dropdown.toggle();
    }

    this.overlayModal
      .create(
        HashtagsSelectorModalComponent,
        {},
        {
          class:
            'm-overlay-modal--hashtag-selector m-overlay-modal--medium-large',
        }
      )
      .onDidDismiss(() => setTimeout(() => this.load()))
      .present();
  }

  @HostListener('window:resize') detectWidth() {
    this.showMenu = window.innerWidth < 1200;
  }
}
