import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Inject,
  Injector,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { FeaturedContentService } from './featured-content.service';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { isPlatformBrowser } from '@angular/common';
import { ActivityComponent } from '../../../modules/newsfeed/activity/activity.component';
import { BoostFeedOpts } from '../../../modules/newsfeed/services/boost-feed.service';

/**
 * Use to insert activity boosts into a feed
 * (Do not use for sidebar/channel boosts)
 */
@Component({
  selector: 'm-featured-content',
  templateUrl: 'featured-content.component.html',
  styleUrls: ['featured-content.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedContentComponent implements OnInit {
  entity: any;

  @Input() slot: number = -1;
  @Input() displayOptions = { isFeed: true };
  @Input() showHeader: boolean = false;
  @Input() servedByGuid: string = null; // channel serving the boost.

  @ViewChild(DynamicHostDirective)
  dynamicHost: DynamicHostDirective;

  constructor(
    protected featuredContentService: FeaturedContentService,
    protected cd: ChangeDetectorRef,
    protected injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    const opts: BoostFeedOpts = {};
    if (this.servedByGuid) {
      opts.servedByGuid = this.servedByGuid;
    }
    await this.featuredContentService.onInit(opts);
    if (isPlatformBrowser(this.platformId)) this.load();
  }

  async load() {
    try {
      this.entity = await this.featuredContentService.fetch();
    } catch (e) {
      console.error('FeaturedContentComponent.load', e);
    }

    this.update();

    this.detectChanges();
  }

  clear() {
    this.detectChanges();

    if (this.dynamicHost) {
      this.dynamicHost.viewContainerRef.clear();
    }
  }

  update() {
    this.clear();

    const { component, injector } = this.resolve();

    if (!this.dynamicHost) {
      console.log(
        'tried to load a boost but no dynamicHost found',
        this.entity
      );
      return;
    }

    if (component) {
      const componentRef: ComponentRef<any> =
        this.dynamicHost.viewContainerRef.createComponent(component, {
          injector: this.injector,
        });
      injector.call(this, componentRef, this.entity);
    }
  }

  resolve() {
    if (!this.entity) {
      return {};
    }

    if (this.entity.type === 'activity') {
      return {
        component: ActivityComponent,
        injector: (componentRef, entity) => {
          componentRef.instance.entity = entity;
          componentRef.instance.displayOptions = this.displayOptions ?? {};
          //componentRef.instance.slot = this.slot;
          componentRef.changeDetectorRef.detectChanges();
        },
      };
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
