import { Component, Input, OnInit } from '@angular/core';
import { SnapshotProposal } from '../snapshot.service';

@Component({
  selector: 'm-governance__card',
  templateUrl: './card.component.html',
})
export class GovernanceCardComponent implements OnInit {
  @Input() proposal: SnapshotProposal;

  constructor() {}

  ngOnInit() {}
}
