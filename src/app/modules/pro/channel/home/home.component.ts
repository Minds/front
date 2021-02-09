import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NavItems, ProChannelService } from '../channel.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { MetaService } from '../../../../common/services/meta.service';

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

  showFeed: boolean = false;

  constructor(
    protected router: Router,
    protected channelService: ProChannelService,
    protected modalService: OverlayModalService,
    protected cd: ChangeDetectorRef,
    protected metaService: MetaService
  ) {}

  /**
   * Listen to scroll, show feed when bottom reached.
   */
  // @HostListener('window:scroll', ['$event'])
  // onScroll(event) {
  //   const element = event.target.activeElement;
  //   if (
  //     !this.showFeed &&
  //     element.scrollTop + element.clientHeight / 2 >= element.scrollHeight / 2
  //   ) {
  //     this.showFeed = true;
  //   }
  // }

  ngOnInit() {
    this.setMenuNavItems();
    this.updateMeta();
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
      this.channelService.getRouterLink('feed', { hashtag: tag })
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

  /**
   * Updates metatags of channel.
   */
  private updateMeta(): void {
    const proSettings = this.channelService.currentChannel.pro_settings;
    this.metaService
      .setTitle(proSettings.title)
      .setDescription(proSettings.headline)
      .setOgImage(proSettings.logo_image);
  }
}
