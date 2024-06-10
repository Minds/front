import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Compiler,
  Component,
  Injector,
  ViewChild,
} from '@angular/core';
import { DynamicHostDirective } from '../../../../common/directives/dynamic-host.directive';
import { ActivityComponent } from '../../../newsfeed/activity/activity.component';
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
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadActivityModule();
  }

  loadActivityModule() {
    const activity =
      this.outletRef.viewContainerRef.createComponent(ActivityComponent);

    activity.instance.entity = this.service.remind$.getValue();
    activity.instance.displayOptions = {
      showToolbar: false,
      showComments: false,
      showPostMenu: false,
      showPinnedBadge: false,
      showMetrics: false,
      isComposerPreview: true,
    };

    activity.changeDetectorRef.detectChanges();
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
