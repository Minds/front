import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SignupModalService } from '../../modals/signup/service';
import { Session } from '../../../services/session';
import { FeaturesService } from '../../../services/features.service';
import { WireCreatorComponent } from '../v2/creator/wire-creator.component';
import { ModalService } from '../../../services/ux/modal.service';
import { ExperimentsService } from '../../experiments/experiments.service';

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
    private experiments: ExperimentsService
  ) {}

  ngOnInit(): void {
    this.activityV2Feature = this.experiments.hasVariation(
      'front-5229-activities',
      true
    );
  }

  async wire() {
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
