import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Compiler,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  Injector,
  Input,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DynamicHostDirective } from '../../../../common/directives/dynamic-host.directive';
import { ActivityComponent } from '../../../newsfeed/activity/activity.component';
import { ComposerService } from '../../services/composer.service';

@Component({
  selector: 'm-composerRemindPreview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'remind-preview.component.html',
  styleUrls: ['./remind-preview.component.ng.scss'],
})
export class RemindPreviewComponent {
  @ViewChild(DynamicHostDirective, { static: true })
  outletRef: DynamicHostDirective;

  /**
   * Constructor
   * @param mediaProxy
   */
  constructor(
    protected service: ComposerService,
    protected injector: Injector,
    protected compiler: Compiler,
    protected componentFactoryResolver: ComponentFactoryResolver,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadActivityModule();
  }

  loadActivityModule() {
    // ojm todo - get activityV2 if feature flag
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      ActivityComponent
    );
    // const activity = componentFactory.create(this.injector);

    const activity = this.outletRef.viewContainerRef.createComponent(
      componentFactory
    );

    activity.instance.entity = this.service.remind$.getValue();
    activity.instance.displayOptions = {
      showToolbar: false,
      showComments: false,
      showPostMenu: false,
      showPinnedBadge: false,
      showMetrics: false,
    };

    activity.changeDetectorRef.detectChanges();
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
