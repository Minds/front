import { Component } from '@angular/core';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { TopbarService } from '../../../common/layout/topbar.service';
import { BehaviorSubject } from 'rxjs';
import { TopbarComponent } from '~/common/layout/topbar/topbar.component';
import { SearchSharedModule } from '~/modules/search/search-shared.module';
import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { IfTenantDirective } from '~/common/directives/if-tenant.directive';
import { CommonModule } from '~/common/common.module';
import { TopbarWalletBalance } from '~/common/layout/topbar/topbar-wallet-balance/topbar-wallet-balance.component';

@Component({
  selector: 'm-topbarwrapper',
  templateUrl: 'topbar.component.html',
  styleUrls: ['topbar.component.ng.scss'],
  imports: [
    AsyncPipe,
    TopbarComponent,
    SearchSharedModule,
    NgIf,
    NgTemplateOutlet,
    IfTenantDirective,
    CommonModule,
    TopbarWalletBalance,
  ],
})
export class TopbarWrapperComponent {
  /** Whether topbar is being displayed in minimal light mode. */
  public readonly isMinimalLightMode$: BehaviorSubject<boolean> =
    this.topbarService.isMinimalLightMode$;

  /** Whether topbar is being displayed in minimal mode. */
  public readonly isMinimalMode$: BehaviorSubject<boolean> =
    this.topbarService.isMinimalMode$;

  constructor(
    public session: Session,
    private router: Router,
    private topbarService: TopbarService
  ) {}

  /**
   * Handles click on gift icon.
   * @returns { void }
   */
  public onGiftIconClick(): void {
    this.router.navigate(['/wallet/credits/send']);
  }
}
