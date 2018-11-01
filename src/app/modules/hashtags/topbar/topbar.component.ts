import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  ChangeDetectorRef,
  HostListener,
  ViewChild
} from '@angular/core';
import { Client } from '../../../services/api/client';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { HashtagsSelectorModalComponent } from '../hashtag-selector-modal/hashtags-selector.component';
import { TopbarHashtagsService } from '../service/topbar.service';
import { Subscription } from 'rxjs';
import { DropdownComponent } from '../../../common/components/dropdown/dropdown.component';

type Hashtag = {
  value: string, selected: boolean
};

@Component({
  selector: 'm-topbar--hashtags',
  templateUrl: 'topbar.component.html'
})
export class TopbarHashtagsComponent implements OnInit {

  hashtags: Hashtag[] = [];
  @Output() selectionChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  all: boolean = false;
  @Input('enabled') enabled: boolean = true;

  showMenu: boolean = false;

  @ViewChild('dropdown') dropdown: DropdownComponent;

  private selectionChangeSubscription: Subscription;

  constructor(
    public overlayModal: OverlayModalService,
    public service: TopbarHashtagsService,
    private cd: ChangeDetectorRef
  ) {
  }

  async ngOnInit() {
    await this.load();

    this.selectionChangeSubscription = this.service.selectionChange.subscribe(({ hashtag, emitter }) => {
      //if (emitter === this)
      //  return;
      const tag = this.hashtags.find((item) => item.value === hashtag.value);
      if (tag) {
        tag.selected = hashtag.selected;
      } else if (hashtag.selected) {
        // if it's not in the collection AND it's a selection, then add it
        this.hashtags = [hashtag, ...this.hashtags.slice(0, 5)];
      }
      this.cd.markForCheck();
      this.cd.detectChanges();
    });

    this.detectWidth();
  }

  async load() {
    try {
      this.hashtags = await this.service.load(5);
    } catch (e) {
      console.error(e);
    }
  }

  ngOnDestroy() {
    if (this.selectionChangeSubscription)
      this.selectionChangeSubscription.unsubscribe();
  }

  async toggleAll() {
    if (this.dropdown) {
      this.dropdown.toggle();
    }
    this.all = !this.all;

    await this.selectionChange.emit(this.all);
  }

  disableAll() {
    this.all = false;
    this.selectionChange.emit(this.all);
  }

  async toggleHashtag(hashtag: Hashtag) {
    if (this.dropdown) {
      this.dropdown.toggle();
    }

    if (!this.enabled) {
      this.selectionChange.emit(this.all);
      return;
    }

    if (this.all) {
      this.disableAll();
      const selected = this.hashtags.find((item) => item.value === hashtag.value);
      if (selected.selected) {
        return;
      }
    }

    await this.service.toggleSelection(hashtag, this);

    this.selectionChange.emit(this.all);
  }

  openModal() {
    if (this.dropdown) {
      this.dropdown.toggle();
    }

    if (this.all)
      this.disableAll();

    this.overlayModal.create(HashtagsSelectorModalComponent, {}, {
      class: 'm-overlay-modal--hashtag-selector m-overlay-modal--medium-large'
    })
      .onDidDismiss(() => {
        this.selectionChange.emit(this.all);

        setTimeout(() => this.load());
      })
      .present();
  }

  @HostListener('window:resize') detectWidth() {
    this.showMenu = window.innerWidth < 1200;
  }
}
