import { Component, OnInit } from '@angular/core';
import { MobileAppPreviewService } from '../../services/mobile-app-preview.service';
import { Observable } from 'rxjs';

/** Base component for mobile app build configuration. */
@Component({
  selector: 'm-networkAdminConsole__mobile',
  templateUrl: './mobile.component.html',
  styleUrls: [
    './mobile.component.ng.scss',
    '../../stylesheets/network-admin-mobile.ng.scss',
  ],
})
export class NetworkAdminConsoleMobileComponent implements OnInit {
  /** Whether init is in progress. */
  public readonly initInProgress$: Observable<boolean> = this
    .MobileAppPreviewService.initInProgress$;

  constructor(private MobileAppPreviewService: MobileAppPreviewService) {}

  ngOnInit(): void {
    this.MobileAppPreviewService.init();
  }
}
