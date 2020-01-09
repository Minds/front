import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { MindsTitle } from '../../../services/ux/title';
import { V2TopbarService } from '../../layout/v2-topbar/v2-topbar.service';

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
    protected title: MindsTitle,
    private topbarService: V2TopbarService
  ) {}

  ngOnInit() {
    if (this.pageTitle) {
      this.title.setTitle(this.pageTitle);
    }

    this.topbarService.toggleMarketingPages(
      true,
      this.showBottombar,
      this.forceBackground
    );
  }

  ngOnDestroy() {
    this.topbarService.toggleMarketingPages(false);
  }
}
