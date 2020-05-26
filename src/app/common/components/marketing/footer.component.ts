import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  OnInit,
  HostListener,
  Injector,
  SkipSelf,
} from '@angular/core';
import { ConfigsService } from '../../services/configs.service';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { LanguageModalComponent } from '../../../modules/language/language-modal/language-modal.component';
import { BehaviorSubject } from 'rxjs';
import { FeaturesService } from '../../../services/features.service';

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
    protected cd: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    public features: FeaturesService,
    @SkipSelf() private injector: Injector
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
