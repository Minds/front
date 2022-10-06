import { Component, OnInit } from '@angular/core';
import { WireV2Service } from '../../wire-v2.service';

@Component({
  selector: 'm-wireCreator__terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.ng.scss'],
})
export class WireCreatorTermsComponent implements OnInit {
  refundPolicyAgreed: boolean = false;

  /**
   * Constructor
   * @param service
   */
  constructor(public service: WireV2Service) {}

  ngOnInit(): void {}
}
