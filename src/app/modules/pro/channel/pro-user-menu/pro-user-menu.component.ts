import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
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

  // added this again since removed by mistake
  @Input() channelName: string;
  @Input() showNavItems: boolean;
  @Input() query: string;

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
