import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  Input,
  OnInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { FeaturedContentService } from './featured-content.service';
import { DynamicHostDirective } from '../../directives/dynamic-host.directive';
import { isPlatformBrowser } from '@angular/common';
import { FeaturesService } from '../../../services/features.service';
import { ActivityComponent } from '../../../modules/newsfeed/activity/activity.component';

/**
 * Use to insert activity boosts into a feed
 * (Do not use for sidebar/channel boosts)
 */
@Component({
  selector: 'm-featured-content',
  templateUrl: 'featured-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedContentComponent implements OnInit {
  entity: any;

  @Input() slot: number = -1;
  @Input() displayOptions = { isFeed: true };

  @ViewChild(DynamicHostDirective)
  dynamicHost: DynamicHostDirective;

  constructor(
    protected featuredContentService: FeaturedContentService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected cd: ChangeDetectorRef,
    protected featuresService: FeaturesService,
    protected injector: Injector,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) this.load();
    console.log('ojm FEATCONTENTCOMP oninit, ');
  }

  async load() {
    console.log('ojm FEATCONTENTCOMP load(), ');

    try {
      this.entity = await this.featuredContentService.fetch();
      console.log('ojm FEATCONTENTCOMP load()2, ', this.entity);
    } catch (e) {
      console.error('FeaturedContentComponent.load', e);
    }

    this.update();
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
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory<
        any
      >(component);

      const componentRef: ComponentRef<any> = this.dynamicHost.viewContainerRef.createComponent(
        componentFactory,
        void 0,
        this.injector
      );
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
