import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NavItems, ProChannelService } from '../channel.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

@Component({
  selector: 'm-pro--channel-home',
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: 'home.component.html',
})
export class ProChannelHomeComponent implements OnInit, OnDestroy {
  inProgress: boolean = false;

  categories: Array<{
    tag: { tag: string; label: string };
    content: Array<Observable<any>>;
  }> = [];

  moreData: boolean = true;

  constructor(
    protected router: Router,
    protected channelService: ProChannelService,
    protected modalService: OverlayModalService,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.setMenuNavItems();
  }

  ngOnDestroy() {
    this.channelService.destroyMenuNavItems();
  }

  setMenuNavItems() {
    const tags = this.channelService.currentChannel.pro_settings.tag_list.concat(
      []
    );
    const navItems: Array<NavItems> = tags.map(tag => ({
      label: tag.label,
      onClick: () => {
        this.navigateToCategory(tag.tag);
      },
      isActive: () => {
        return false;
      },
    }));

    this.channelService.pushMenuNavItems(navItems, true);
  }

  getCategoryRoute(tag) {
    if (!this.channelService.currentChannel || !tag) {
      return [];
    }

    return this.channelService.getRouterLink('all', { hashtag: tag });
  }

  onContentClick(entity: any) {
    return this.channelService.open(entity, this.modalService);
  }

  navigateToCategory(tag) {
    this.router.navigate(
      this.channelService.getRouterLink('all', { hashtag: tag })
    );
  }

  get settings() {
    return (
      this.channelService.currentChannel &&
      this.channelService.currentChannel.pro_settings
    );
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
