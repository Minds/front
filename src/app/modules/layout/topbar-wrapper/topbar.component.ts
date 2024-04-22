import { Component } from '@angular/core';
import { Session } from '../../../services/session';
import { Router } from '@angular/router';
import { TopbarService } from '../../../common/layout/topbar.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'm-topbarwrapper',
  templateUrl: 'topbar.component.html',
  styleUrls: ['topbar.component.ng.scss'],
})
export class TopbarWrapperComponent {
  /** Whether topbar is being displayed in minimal light mode. */
  public readonly isMinimalLightMode$: BehaviorSubject<boolean> =
    this.topbarService.isMinimalLightMode$;

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
