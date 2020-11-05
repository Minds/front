import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DiscoveryTag, DiscoveryTagsService } from '../tags.service';

@Component({
  selector: 'm-discovery__tagButton',
  templateUrl: './tag-button.component.html',
  styleUrls: ['./tag-button.component.ng.scss'],
})
export class DiscoveryTagButtonComponent implements OnDestroy {
  @Input() tag: DiscoveryTag;

  recentlyToggled: boolean = false;
  recentlySelected: boolean = false;
  hovering: boolean = false;

  timeout: any;

  constructor(private service: DiscoveryTagsService) {}

  ngOnDestroy(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

  async addTag(): Promise<void> {
    this.tag.selected = true;
    this.recentlySelected = true;
    this.recentlyToggled = true;

    let saved = await this.service.addSingleTag(this.tag);

    this.resetTimeout();

    if (!saved) {
      this.tag.selected = false;
      this.recentlyToggled = false;
    }
  }

  async removeTag(): Promise<void> {
    this.tag.selected = false;
    this.recentlySelected = false;
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
