import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SignupModalService } from '../../modals/signup/service';
import { Session } from '../../../services/session';
import { FeaturesService } from '../../../services/features.service';
import { WireCreatorComponent } from '../v2/creator/wire-creator.component';
import { ModalService } from '../../../services/ux/modal.service';
import { ExperimentsService } from '../../experiments/experiments.service';
import { ActivityV2ExperimentService } from '../../experiments/sub-services/activity-v2-experiment.service';

/**
 * Button that triggers the wire modal
 *
 * Note: "wires" are now called "tips"
 *
 * See it in an activity toolbar of a post that is not your own
 */
@Component({
  selector: 'm-wire-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.ng.scss'],
})
export class WireButtonComponent implements OnInit {
  @Input() object: any;
  @Output('done') doneEmitter: EventEmitter<any> = new EventEmitter();

  activityV2Feature: boolean = false;

  constructor(
    public session: Session,
    private modal: SignupModalService,
    public features: FeaturesService,
    private modalService: ModalService,
    private activityV2Experiment: ActivityV2ExperimentService
  ) {}

  ngOnInit(): void {
    this.activityV2Feature = this.activityV2Experiment.isActive();
  }

  async wire($event) {
    $event.stopPropagation();
    if (!this.session.isLoggedIn()) {
      this.modal.open();

      return;
    }

    const modal = this.modalService.present(WireCreatorComponent, {
      size: 'lg',
      data: {
        entity: this.object,
        default: this.object && this.object.wire_threshold,
        onComplete: () => modal.close(),
      },
    });
  }
}
