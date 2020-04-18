import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '../../../../services/session';

@Component({
  selector: 'm-youtubeMigration__dashboard',
  templateUrl: './dashboard.component.html',
})
export class YoutubeMigrationDashboardComponent implements OnInit {
  constructor(protected router: Router, protected session: Session) {}

  ngOnInit() {}
}
