import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Session } from "../../../services/session";

@Component({
  selector: 'm-v2-topbar',
  templateUrl: 'v2-topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class V2TopbarComponent implements OnInit {
  minds = window.Minds;

  constructor(
    protected session: Session,
    protected cd: ChangeDetectorRef
  ) {
  }

  ngOnInit() {
    this.session.isLoggedIn(() => this.detectChanges());
  }

  getCurrentUser() {
    return this.session.getLoggedInUser();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
