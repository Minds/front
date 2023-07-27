import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GiftCardClaimPanelService } from '../panel.service';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  catchError,
  map,
  of,
  take,
} from 'rxjs';
import {
  GiftCardNode,
  GiftCardProductIdEnum,
} from '../../../../../../graphql/generated.engine';
import { GiftCardService } from '../../../gift-card.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { GiftCardClaimPanelEnum } from '../claim-panel.enum';

/**
 * Panel for the redemption / claiming of a gift card.
 * Will NOT allow the user to attempt claim if the card is already claimed.
 */
@Component({
  selector: 'm-giftCardClaimPanel__redeem',
  templateUrl: 'redeem-panel.component.html',
  styleUrls: ['./redeem-panel.component.ng.scss'],
})
export class GiftCardClaimRedeemPanelComponent implements OnInit, OnDestroy {
  /** The claim code from the URL. */
  private claimCode: string = null;

  /** Gift card loaded by code. */
  public readonly giftCardNode$: BehaviorSubject<
    GiftCardNode
  > = new BehaviorSubject<GiftCardNode>(null);

  /** Whether gift card has been loaded from code or is in progress. */
  public readonly giftCardLoaded$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Whether a gift card claim request is in progress. */
  public readonly giftCardClaimInProgress$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** The description to be shown for the panels set productId. */
  public readonly description$: Observable<
    string
  > = this.panelService.productId$.pipe(
    map((productId: GiftCardProductIdEnum): string => {
      switch (productId) {
        case GiftCardProductIdEnum.Boost:
          return $localize`:@@GIFT_CARD_PANEL_REDEEM_PANEL__BOOST_DESCRIPTION:Boost credits can be used to Boost a post or your channel, which can help increase your reach, grow your subscriber base, and enhance your engagement.`;
        default:
          return null;
      }
    })
  );

  /** Whether the gift card is already claimed. */
  public isAlreadyClaimed$: Observable<boolean> = this.giftCardNode$.pipe(
    map((giftCardNode: GiftCardNode): boolean => {
      return (
        Boolean(giftCardNode?.claimedAt) || Boolean(giftCardNode.claimedByGuid)
      );
    })
  );

  // subscriptions.
  private getGiftCardByCodeSubscription: Subscription;
  private giftCardClaimSubscription: Subscription;

  constructor(
    private service: GiftCardService,
    private panelService: GiftCardClaimPanelService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToasterService
  ) {}

  ngOnInit(): void {
    // on init get claim code from URL and load the associated gift card.
    this.claimCode = this.route.snapshot.paramMap.get('claimCode');
    this.loadGiftCardByCode(this.claimCode);
  }

  ngOnDestroy(): void {
    this.getGiftCardByCodeSubscription?.unsubscribe();
    this.giftCardClaimSubscription?.unsubscribe();
  }

  /**
   * Fires on redeem button click. Will claim the gift card and navigate to next panel.
   * @returns { void }
   */
  public onRedeemClick(): void {
    this.giftCardClaimInProgress$.next(true);

    this.giftCardClaimSubscription = this.service
      .claimGiftCard(this.claimCode)
      .pipe(
        take(1),
        catchError(
          (e: unknown): Observable<null> => {
            console.error(e);
            return of(null);
          }
        )
      )
      .subscribe((giftCard: GiftCardNode): void => {
        this.giftCardClaimInProgress$.next(false);
        if (!giftCard) {
          this.toast.error(
            'Sorry, something went wrong while claiming your gift card.'
          );
          return;
        }
        this.panelService.activePanel$.next(GiftCardClaimPanelEnum.Success);
      });
  }

  /**
   * Load a gift card by claim code.
   * @param { string } claimCode - claim code to load gift card for.
   * @returns { void }
   */
  private loadGiftCardByCode(claimCode: string): void {
    this.getGiftCardByCodeSubscription = this.service
      .getGiftCardByCode(claimCode)
      .pipe(
        take(1),
        catchError(
          (e: unknown): Observable<null> => {
            console.error(e);
            return of(null);
          }
        )
      )
      .subscribe((giftCardNode: GiftCardNode): void => {
        if (giftCardNode) {
          this.giftCardNode$.next(giftCardNode);
          this.giftCardLoaded$.next(true);
          this.panelService.productId$.next(giftCardNode.productId);
        } else {
          this.toast.error('Sorry, we were unable to load your gift card.');
          this.router.navigate(['/']);
        }
      });
  }
}
