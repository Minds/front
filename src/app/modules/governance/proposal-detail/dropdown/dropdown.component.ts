import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'm-governance--proposal-detail-dropdown',
  templateUrl: './dropdown.component.html',
})
export class GovernanceProposalDetailDropdownComponent implements OnInit {
  isOpened = false;
  constructor() {}

  ngOnInit() {}

  onButtonClick(e: MouseEvent): void {
    this.isOpened = !this.isOpened;
  }
}
