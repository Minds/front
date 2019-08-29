import { Component } from '@angular/core';
import { NoticesService } from './notices.service';
import { Storage } from '../../services/storage';

@Component({
  selector: 'm-notices__sidebar',
  templateUrl: 'sidebar.component.html',
})
export class NoticesSidebarComponent {
  minds = window.Minds;
  hidden: boolean = false;
  notices: Array<any> = [];
  displayLimit: number = 3;
  inProgress: boolean = false;

  constructor(private service: NoticesService, private storage: Storage) {}

  async ngOnInit() {
    let hiddenNoticesTs = this.storage.get('hide-notices-ts');
    if (hiddenNoticesTs) this.hidden = true;

    await this.load();

    if (hiddenNoticesTs && hiddenNoticesTs < this.notices[0].timestamp) {
      this.hidden = false;
    }
  }

  async load() {
    this.inProgress = true;
    let limit: number = 5;

    this.notices = await this.service.getNotices();

    this.inProgress = false;
  }

  isRecent(notice) {
    return notice.timestamp > Date.now() - 172800000; // 48 hours
  }

  hide() {
    this.hidden = true;
    this.storage.set('hide-notices-ts', this.notices[0].timestamp);
  }

  showAll() {
    this.displayLimit = 999999;
  }
}
