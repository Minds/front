import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'm-analytics__dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class AnalyticsDropdownComponent implements OnInit {
  @Input() filter: string;

  constructor() {}

  ngOnInit() {}
}
