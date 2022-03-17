import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Session } from '../../../../services/session';
import { AuthModalService } from '../../../auth/modal/auth-modal.service';
import { DiscoveryTag, DiscoveryTagsService } from '../tags.service';

@Component({
  selector: 'm-discovery__tagButton',
  templateUrl: './tag-button.component.html',
  styleUrls: ['./tag-button.component.ng.scss'],
})
export class DiscoveryTagButtonComponent implements OnDestroy {
  @Input() tag: DiscoveryTag;

  recentlyToggled: boolean = false;
  hovering: boolean = false;

  timeout: any;

  constructor(
    private service: DiscoveryTagsService,
    private authModal: AuthModalService,
    private session: Session
  ) {}

  ngOnDestroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  async addTag(): Promise<void> {
    if (!this.session.isLoggedIn()) {
      const user = await this.authModal.open({ formDisplay: 'login' });
      if (!user) return;
    }

    this.tag.selected = true;
    this.recentlyToggled = true;

    let saved = await this.service.addSingleTag(this.tag);

    this.resetTimeout();

    if (!saved) {
      this.tag.selected = false;
      this.recentlyToggled = false;
    }
  }

  async removeTag(): Promise<void> {
    if (!this.session.isLoggedIn()) {
      const user = await this.authModal.open({ formDisplay: 'login' });
      if (!user) return;
    }

    this.tag.selected = false;
    this.recentlyToggled = true;

    let saved = await this.service.removeSingleTag(this.tag);

    this.resetTimeout();

    if (!saved) {
      this.tag.selected = false;
      this.recentlyToggled = false;
    }
  }

  resetTimeout(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.recentlyToggled = false;
    }, 2000);
  }

  get icon(): string {
    if (!this.tag.selected) {
      return 'add';
    }
    if (this.hovering && !this.recentlyToggled) {
      return 'remove';
    } else {
      return 'check';
    }
  }
}
