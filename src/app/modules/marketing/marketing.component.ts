import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MetaService } from '../../common/services/meta.service';
import { TopbarService } from '../../common/layout/topbar.service';
import { PageLayoutService } from '../../common/layout/page-layout.service';

@Component({
  selector: 'm-marketing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'marketing.component.html',
})
export class MarketingComponent implements OnInit, OnDestroy {
  @Input() pageTitle: string = '';
  @Input() showBottombar: boolean = true;
  @Input() forceBackground: boolean = true;
  @Input() useFullWidth: boolean = true;

  constructor(
    protected metaService: MetaService,
    private navigationService: TopbarService,
    private pageLayoutService: PageLayoutService
  ) {}

  ngOnInit() {
    if (this.pageTitle) {
      this.metaService.setTitle(this.pageTitle);
    }

    if (this.useFullWidth) {
      this.pageLayoutService.useFullWidth();
    } else {
      this.pageLayoutService.cancelFullWidth();
    }

    this.navigationService.toggleMarketingPages(
      true,
      this.showBottombar,
      this.forceBackground
    );
  }

  ngOnDestroy() {
    this.navigationService.toggleMarketingPages(false);
  }
}
