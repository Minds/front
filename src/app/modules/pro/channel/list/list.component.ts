import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { FeedsService } from '../../../../common/services/feeds.service';
import {
  NavItems,
  ProChannelService,
  RouterLinkToType,
} from '../channel.service';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

@Component({
  selector: 'm-proChannel__list',
  templateUrl: 'list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FeedsService],
})
export class ProChannelListComponent implements OnInit, OnDestroy {
  paramsType: string; // exact string that came from the router params
  type: string;
  params$: Subscription;
  query: string;
  period: string;
  selectedHashtag: string = 'all';

  constructor(
    public feedsService: FeedsService,
    protected modalService: OverlayModalService,
    protected channelService: ProChannelService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected cd: ChangeDetectorRef,
    protected injector: Injector
  ) {}

  ngOnInit() {
    this.params$ = this.route.params.subscribe(params => {
      if (params['type']) {
        this.type = this.paramsType = params['type'];

        switch (params['type']) {
          case 'all':
            this.type = 'all';
            break;
          case 'videos':
            this.type = 'videos';
            break;
          case 'images':
            this.type = 'images';
            break;
          case 'articles':
            this.type = 'blogs';
            break;
          case 'groups':
            this.type = 'groups';
            break;
          case 'feed':
            this.type = 'activities';
            break;
          default:
            throw new Error('Unknown type');
        }
      }

      this.query = params['query'] || '';
      this.period = params['period'] || '';
      this.selectedHashtag = params['hashtag'] || 'all';
      this.setMenuNavItems();
      this.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.params$) {
      this.params$.unsubscribe();
    }

    this.channelService.destroyMenuNavItems();
  }

  setMenuNavItems() {
    const tags = this.channelService.currentChannel.pro_settings.tag_list.concat(
      []
    );

    tags.unshift({ label: 'All', tag: 'all', selected: false });

    const navItems: Array<NavItems> = tags.map(tag => ({
      label: tag.label,
      onClick: () => {
        this.selectHashtag(tag.tag);
      },
      isActive: () => {
        return this.selectedHashtag === tag.tag;
      },
    }));

    this.channelService.pushMenuNavItems(navItems, true);
  }

  selectHashtag(tag: string) {
    let params;

    if (tag) {
      params = { hashtag: tag };
    }

    return this.router.navigate(
      this.channelService.getRouterLink(
        this.paramsType as RouterLinkToType,
        params
      )
    );
  }

  get shouldShowCategories() {
    return this.paramsType !== 'groups' && !this.query;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
