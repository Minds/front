import { Component } from '@angular/core';
import { NoticesService } from './notices.service';

@Component({
  selector: 'm-notices__sidebar',
  templateUrl: 'sidebar.component.html' 
})

export class NoticesSidebarComponent {

  minds = window.Minds;
  notices: Array<any> = [ ];
  inProgress: boolean = false;

  constructor(
    private service: NoticesService,
  ) {
  }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.inProgress = true;
    let limit: number = 5;

    this.notices = await this.service.getNotices();

    this.inProgress = false;
  }

  isRecent(notice) {
    return notice.timestamp > (Date.now() - 172800000); // 48 hours
  }

}

