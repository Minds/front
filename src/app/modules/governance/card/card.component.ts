import { Component, Input, OnInit } from '@angular/core';
import { SnapshotProposal } from '../snapshot.service';

@Component({
  selector: 'm-governance__card',
  templateUrl: './card.component.html',
})
export class GovernanceCardComponent implements OnInit {
  @Input() proposal: SnapshotProposal;
  @Input() showHeader: boolean;

  isLong = false;

  constructor() {}

  ngOnInit() {
    this.checkLength(this.proposal.body);
  }

  checkLength(text: string) {
    if (text.length > 360) {
      this.isLong =  true;
    }
  }
}
