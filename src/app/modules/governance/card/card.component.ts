import { Component, OnInit, Input } from '@angular/core';
import { GovernanceLatest } from '../latest/latest.service';
@Component({
  selector: 'm-governance__card',
  templateUrl: './card.component.html',
})
export class GovernanceCardComponent implements OnInit {
  @Input() card: GovernanceLatest;
  constructor() {}

  ngOnInit() {}
}
