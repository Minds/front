import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShareModalComponent } from '../../../../modules/modals/share/share';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';
import { FormToastService } from '../../../../common/services/form-toast.service';
import { SnapshotProposal, SnapshotService } from '../../snapshot.service';
@Component({
  selector: 'm-governance--proposal-detail-dropdown',
  templateUrl: './dropdown.component.html',
})
export class GovernanceProposalDetailDropdownComponent implements OnInit {
  isOpened = false;
  constructor(
    private readonly snapshotService: SnapshotService,
    private readonly router: Router,
    private readonly toasterService: FormToastService,
    private overlayModal: OverlayModalService,) { }

  @Input() allowDelete: boolean;
  @Input() proposal: SnapshotProposal;

  ngOnInit() {
  }

  onButtonClick(e: MouseEvent): void {
    this.isOpened = !this.isOpened;
  }

  async deleteProposal() {
    await this.snapshotService
      .deleteProposal(this.proposal)
      .then((data: SnapshotProposal) => {
        this.router.navigate(['/governance/latest'])
        this.toasterService.success('Proposal successfully deleted');
      }
      );
  }

  openShareModal() {
    const data = {
      url: `https://www.minds.com/governance/proposal/${this.proposal.id}`
    };

    this.overlayModal
      .create(ShareModalComponent, data, {
        class: 'm-overlay-modal--medium m-overlayModal__share',
      })
      .present();
  }
}
