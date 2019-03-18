import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Session } from "../../../services/session";

@Component({
  selector: 'm-user-menu',
  templateUrl: 'user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMenuComponent implements OnInit {
  isOpen: boolean = false;

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

  isAdmin() {
    return this.session.isAdmin();
  }

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
