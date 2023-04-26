import {
  Component,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { ConfigsService } from '../../../common/services/configs.service';
import { isPlatformBrowser } from '@angular/common';

/**
 * Loading panel for use while going to stripe checkout to add a new card.
 */
@Component({
  selector: 'm-payments__newCard',
  templateUrl: 'new-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./new-card.component.ng.scss'],
})
export class PaymentsNewCard {
  @Output() completed: EventEmitter<void> = new EventEmitter();
  private _opts: any;

  constructor(
    public cd: ChangeDetectorRef,
    private configs: ConfigsService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.goToCheckout();
    }
  }

  /**
   * Set modal data
   * @param opts - opts containing onCompleted function.
   * @returns { void }
   */
  setModalData(opts: { onCompleted: () => void }): void {
    this._opts = opts;
  }

  /**
   * Will open stripe checkout in a new window and poll for closed event.
   * @returns { void }
   */
  public goToCheckout(): void {
    const windowRef = window.open(
      this.configs.get('site_url') + 'api/v3/payments/stripe/checkout/setup',
      '_blank'
    );
    const timer = setInterval(() => {
      if (windowRef.closed) {
        clearInterval(timer);

        this.completed.next();
        this._opts?.onCompleted?.();
        this.detectChanges();
      }
    }, 500);
  }

  /**
   * Run change detection manually.
   * @returns { void }
   */
  public detectChanges(): void {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
