import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MetaService } from '../../services/meta.service';
import { TopbarService } from '../../layout/topbar.service';

@Component({
  selector: 'm-marketing',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'marketing.component.html',
})
export class MarketingComponent implements OnInit, OnDestroy {
  @Input() pageTitle: string = '';
  @Input() showBottombar: boolean = true;
  @Input() forceBackground: boolean = true;

  constructor(
    protected metaService: MetaService,
    private navigationService: TopbarService
  ) {}

  ngOnInit() {
    if (this.pageTitle) {
      this.metaService.setTitle(this.pageTitle);
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
