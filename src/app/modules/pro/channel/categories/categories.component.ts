import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProChannelService } from "../channel.service";
import { Router } from "@angular/router";

@Component({
  selector: 'm-pro--channel--categories',
  template: `
    <div
      class="m-proChannel__category"
      [class.m-proChannel__selectedCategory]="!!tag.selected"
      (click)="selectTag(tag)"
      *ngFor="let tag of channel.pro_settings.tag_list"
    >
      {{tag.label}}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProCategoriesComponent implements OnInit {

  @Input() type: string;
  @Input() params: any = {};

  get channel() {
    return this.channelService.currentChannel;
  }

  get currentURL() {
    return `pro/${this.channel.username}/${this.type}`
  }

  constructor(
    protected channelService: ProChannelService,
    protected router: Router,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
  }

  selectTag(clickedTag: any) {
    for (let tag of this.channel.pro_settings.tag_list) {
      tag.selected = tag.tag == clickedTag.tag;
    }

    this.router.navigate([this.currentURL, { ...this.params, hashtag: clickedTag.tag }]);

    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
