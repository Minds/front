import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProService } from '../pro.service';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { MindsTitle } from '../../../services/ux/title';

@Component({
  selector: 'm-pro--settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'settings.component.html'
})
export class ProSettingsComponent implements OnInit {

  settings: any;

  inProgress: boolean;

  saved: boolean = false;

  currentTab: 'general' | 'theme' | 'hashtags' | 'footer' | 'cancel' = 'general';

  constructor(
    protected service: ProService,
    protected session: Session,
    protected router: Router,
    protected cd: ChangeDetectorRef,
    protected title: MindsTitle
  ) {
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;
    this.detectChanges();

    const { isActive, settings } = await this.service.get();

    if (!isActive) {
      this.router.navigate(['/pro'], { replaceUrl: true });
      return;
    }

    this.settings = settings;

    this.title.setTitle('Pro Settings');

    this.inProgress = false;
    this.detectChanges();
  }

  async save() {
    this.inProgress = true;
    this.detectChanges();

    await this.service.set(this.settings);

    this.saved = true;
    this.inProgress = false;
    this.detectChanges();
  }

  addBlankTag() {
    if (!this.settings) {
      return;
    }

    this.settings.tag_list.push({ label: '', tag: '' });
  }

  addBlankFooterLink() {
    if (!this.settings) {
      return;
    }

    this.settings.footer_links.push({ title: '', href: '' });
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  get previewRoute() {
    return ['/pro', this.session.getLoggedInUser().username];
  }
}
