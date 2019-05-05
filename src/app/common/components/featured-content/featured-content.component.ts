import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  ViewChild
} from "@angular/core";
import { FeaturedContentService } from "./featured-content.service";
import { DynamicHostDirective } from "../../directives/dynamic-host.directive";
import { Activity } from "../../../modules/legacy/components/cards/activity/activity";

@Component({
  selector: 'm-featured-content',
  templateUrl: 'featured-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeaturedContentComponent implements OnInit {

  entity: any;

  @ViewChild(DynamicHostDirective) dynamicHost: DynamicHostDirective;

  constructor(
    protected featuredContentService: FeaturedContentService,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    try {
      this.entity = await this.featuredContentService.fetch();
    } catch (e) {
      console.error('FeaturedContentComponent.load', e)
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

    if (!this.dynamicHost) {
      return;
    }

    const {component, injector} = this.resolve();

    if (component) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

      const componentRef: ComponentRef<any> = this.dynamicHost.viewContainerRef.createComponent(componentFactory);
      injector.call(this, componentRef, this.entity);
    }
  }

  resolve() {
    if (!this.entity) {
      return {};
    }

    if (this.entity.type === 'activity') {
      return {
        component: Activity,
        injector: (componentRef, entity) => {
          componentRef.instance.object = entity;
          componentRef.changeDetectorRef.detectChanges();
        }
      };
    }
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
