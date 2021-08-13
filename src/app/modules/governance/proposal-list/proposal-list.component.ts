import { Component, Input, OnInit } from '@angular/core';
import { SnapshotProposal } from '../snapshot.service';

@Component({
  selector: 'm-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.scss'],
})
export class ProposalListComponent implements OnInit {
  @Input() proposals: SnapshotProposal[];

  constructor() {}

  ngOnInit(): void {}
}
