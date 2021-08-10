import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'm-governance',
  templateUrl: './governance.component.html',
})
export class GovernanceComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}
}
