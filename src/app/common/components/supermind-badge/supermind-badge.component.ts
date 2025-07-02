import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'm-supermindBadge',
  templateUrl: './supermind-badge.component.html',
  styleUrls: ['./supermind-badge.component.scss'],
  standalone: false,
})
export class SupermindBadgeComponent implements OnInit {
  @Input() isRequest: boolean = false;

  constructor() {}

  ngOnInit(): void {}
}
