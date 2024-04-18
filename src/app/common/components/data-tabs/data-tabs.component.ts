import {
  Component,
  Input,
  Output,
  EventEmitter,
  Inject,
  AfterViewInit,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataTab } from '../../../interfaces/dashboard';

@Component({
  selector: 'm-dataTabs',
  styleUrls: ['./data-tabs.component.ng.scss'],
  templateUrl: './data-tabs.component.html',
})
export class DataTabsComponent implements AfterViewInit {
  @Input() tabs: DataTab[];
  @Input() activeTabId = '';
  @Input() friendlyVals: boolean = false;
  @Output() tabChanged: EventEmitter<any> = new EventEmitter();

  container;
  tabWidth: number;

  constructor(@Inject(PLATFORM_ID) protected platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const tabEl = <HTMLElement>document.querySelector('.m-dataTab');
        this.tabWidth = tabEl.offsetWidth;

        this.container = <HTMLElement>(
          document.querySelector('.m-dataTabsHeader__container')
        );
      }, 0);
    }
  }

  onMouseEnter($event: MouseEvent, i: number) {
    if (isPlatformBrowser(this.platformId)) {
      if (this.tabs[i].description) {
        const mouseEnterTabEl = document.querySelector(`#m-dataTab--${i}`);

        const bubbleEl =
          mouseEnterTabEl.getElementsByClassName('m-tooltip--bubble')[0];

        const leftPx = i * this.tabWidth - this.container.scrollLeft;
        bubbleEl.setAttribute('style', `left: ${leftPx}px;`);
      }
    }
  }

  changeTabs(tab) {
    this.tabChanged.emit({ tabId: tab.id });
  }
}
