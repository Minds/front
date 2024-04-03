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
  @Input('mExperiment') experimentId: string;
  @Input('mExperimentVariation') variationId: string;

  constructor(
    private service: ExperimentsService,
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  ngOnInit() {
    const variation = this.service.run(this.experimentId);

    if (variation === this.variationId) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
