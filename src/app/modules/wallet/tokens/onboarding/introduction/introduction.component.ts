import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../../services/api/client';
import { Session } from '../../../../../services/session';
import { ConfigsService } from '../../../../../common/services/configs.service';

@Component({
  selector: 'm-token--onboarding--introduction',
  templateUrl: 'introduction.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenIntroductionOnboardingComponent {
  readonly cdnAssetsUrl: string;
  inProgress: boolean = false;
  error: string;

  @Output() next: EventEmitter<any> = new EventEmitter();

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected router: Router,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  detectChange() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
