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
import { ActivityV2Component } from '../../../newsfeed/activity-v2/activity.component';
import { ComposerService } from '../../services/composer.service';

/**
 * Renders a user-friendly preview of the embedded post that is being quoted
 */
@Component({
  selector: 'm-composerPreview--quote',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'quote-preview.component.html',
  styleUrls: ['./quote-preview.component.ng.scss'],
})
export class QuotePreviewComponent {
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
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
      ActivityV2Component
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
