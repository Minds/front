import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  OnInit,
  HostListener,
} from '@angular/core';
import { ConfigsService } from '../../services/configs.service';

@Component({
  selector: 'm-marketing__footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'footer.component.html',
})
export class MarketingFooterComponent implements OnInit {
  readonly year: number = new Date().getFullYear();

  readonly cdnAssetsUrl: string;
  isMobile: boolean;

  constructor(
    private configs: ConfigsService,
    protected cd: ChangeDetectorRef
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.onResize();
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 480;

    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
