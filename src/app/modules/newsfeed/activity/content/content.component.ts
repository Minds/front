import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Subscription, timer } from 'rxjs';

import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService, ActivityEntity } from '../activity.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { Session } from '../../../../services/session';
import { MindsUser, MindsGroup } from '../../../../interfaces/entities';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MediaModalComponent } from '../../../media/modal/modal.component';
import { ActivityRemindComponent } from '../remind/remind.component';
import { delay } from 'q';

@Component({
  selector: 'm-activity__content',
  templateUrl: 'content.component.html',
})
export class ActivityContentComponent {
  @ViewChild('mediaEl', { static: false, read: ElementRef })
  mediaEl: ElementRef;

  @ViewChild('messageEl', { static: false, read: ElementRef })
  messageEl: ElementRef;

  @ViewChild('mediaDesciptionEl', { static: false, read: ElementRef })
  mediaDescriptionEl: ElementRef;

  maxFixedHeightContent: number = 540;
  fixedHeightRatio: number = 500 / 750;
  remindWidth: number;
  remindHeight: number;

  private entitySubscription: Subscription;

  entity: ActivityEntity;

  constructor(
    public service: ActivityService,
    private overlayModal: OverlayModalService,
    private router: Router,
    private el: ElementRef
  ) {}

  ngOnInit() {
    this.entitySubscription = this.service.entity$.subscribe(
      (entity: ActivityEntity) => {
        this.entity = entity;
      }
    );
  }

  ngAfterViewInit() {
    // Run after view initialized
    timer(0)
      .toPromise()
      .then(() => this.calculateRemindHeight());
  }

  ngOnDestroy() {
    this.entitySubscription.unsubscribe();
  }

  get message(): string {
    return this.entity.message || this.entity.title;
  }

  get isRichEmbed(): boolean {
    return !!this.entity.perma_url;
  }

  get mediaDescription(): string {
    return this.entity.blurb
      ? this.entity.blurb + (this.entity.perma_url ? '...' : '')
      : '';
  }

  get isVideo(): boolean {
    return this.entity.custom_type == 'video';
  }

  get videoGuid(): string {
    return this.entity.entity_guid;
  }

  get isImage(): boolean {
    return (
      this.entity.custom_type == 'batch' ||
      (this.entity.thumbnail_src && !this.entity.perma_url)
    );
  }

  get imageUrl(): string {
    if (this.entity.custom_type) {
      return this.entity.custom_data[0].src;
    }

    if (this.entity.thumbnail_src) {
      return this.entity.thumbnail_src;
    }

    return ''; // TODO: placehol;der
  }

  get imageGuid(): string {
    return this.entity.entity_guid;
  }

  @HostListener('window:resize')
  calculateRemindHeight(): void {
    if (!this.service.displayOptions.fixedHeight) return;
    const messageHeight = this.messageEl
      ? this.messageEl.nativeElement.clientHeight
      : 0;

    let maxFixedHeightContent = this.maxFixedHeightContent;

    // Need to allow extra space for comments entry
    if (this.entity['comments:count'] > 0) {
      maxFixedHeightContent = maxFixedHeightContent - 42;
    }

    this.remindHeight = maxFixedHeightContent - messageHeight;
    this.remindWidth = this.remindHeight * this.fixedHeightRatio;
  }

  onModalRequested(event: MouseEvent) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.entity.modal_source_url = this.router.url;

    this.overlayModal
      .create(
        MediaModalComponent,
        { entity: this.entity },
        {
          class: 'm-overlayModal--media',
        }
      )
      .present();
  }

  onImageError(e: Event): void {}
}
