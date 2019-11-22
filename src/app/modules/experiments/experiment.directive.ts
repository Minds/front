import {
  Input,
  Directive,
  EventEmitter,
  ElementRef,
  ViewContainerRef,
  TemplateRef,
} from '@angular/core';

import { ExperimentsService } from './experiments.service';

@Directive({
  selector: '[mExperiment]',
})
export class ExperimentDirective {
  @Input('mExperiment') mExperimentId;
  @Input() mExperimentBuckets: Array<string>;

  constructor(
    private _service: ExperimentsService,
    private _viewContainer: ViewContainerRef,
    private _templateRef: TemplateRef<any>
  ) {}

  async ngOnInit() {
    if (this.mExperimentBuckets.indexOf('base') !== -1)
      //load the base first
      this._viewContainer.createEmbeddedView(this._templateRef);

    if (
      await this._service.shouldRender({
        experimentId: this.mExperimentId,
        bucketIds: this.mExperimentBuckets,
      })
    ) {
      console.log('clearing');
      this._viewContainer.clear();
      this._viewContainer.createEmbeddedView(this._templateRef);
    } else {
      console.log('clearing');
      this._viewContainer.clear();
    }
  }
}
