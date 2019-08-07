import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input } from "@angular/core";
import { Session } from "../../../../services/session";
import { ThemeService } from "../../../../common/services/theme.service";
import { ProChannelService } from "../channel.service";

@Component({
  selector: 'm-pro-user-menu',
  templateUrl: 'pro-user-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProUserMenuComponent implements OnInit {
  isOpen: boolean = false;

  get channel() {
    return this.channelService.currentChannel;
  }

  constructor(
    public channelService: ProChannelService,
    protected session: Session,
    protected cd: ChangeDetectorRef,
    private themeService: ThemeService,
  ) {
  }

  getCurrentUser() {
    return this.session.getLoggedInUser();
  }

  ngOnInit() {
    this.session.isLoggedIn(() => this.detectChanges());
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
    this.themeService.applyThemePreference();
  }

  get linkTo() {
    return this.channelService.linkTo.bind(this.channelService);
  }

}
