import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  SiteMembership,
  SiteMembershipSubscription,
} from '../../../../../graphql/generated.engine';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { SiteMembershipService } from '../../services/site-memberships.service';
import { ToasterService } from '../../../../common/services/toaster.service';

/** Data for single site membership modal. */
export type SingleSiteMembershipModalData = {
  title: string;
  subtitle: string;
  closeCtaText: string;
  membershipGuid: string;
  upgradeMode?: boolean;
  onJoinIntent: () => any;
  onCloseIntent: () => any;
};

/**
 * Single site membership modal component.
 */
@Component({
  selector: 'm-singleSiteMembershipModal',
  templateUrl: 'single-site-membership-modal.component.html',
  styleUrls: ['./single-site-membership-modal.component.ng.scss'],
})
export class SingleSiteMembershipModalComponent implements OnInit, OnDestroy {
  /** Whether component can be considered as initialized. */
  protected readonly initialized$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Site membership. */
  protected readonly siteMembership$: BehaviorSubject<SiteMembership> =
    new BehaviorSubject<SiteMembership>(null);

  /** Modal title. */
  protected title: string = 'Upgrade to unlock';

  /** Modal subtitle. */
  protected subtitle: string =
    "You don't have access to this feature. Please upgrade to one of the below memberships to unlock.";

  /** Close CTA button text. */
  protected closeCtaText: string = 'Go back';

  /** Guid of the membership that is to be displayed. */
  private membershipGuid: string;

  /** Only allows memberships that the user is not a member of to be shown. */
  private upgradeMode: boolean = true;

  /** Subscription to load membership. */
  private loadMembershipSubscription: Subscription;

  /** Subscription to site membership subscriptions. */
  private siteMembershipSubscriptionsSubscription: Subscription;

  /**
   * Dismiss intent.
   */
  onJoinIntent: () => void = () => {};

  /**
   * Dismiss intent.
   */
  onCloseIntent: () => void = () => {};

  constructor(
    private siteMembershipsService: SiteMembershipService,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.loadMembershipSubscription = this.siteMembershipsService
      .loadMembershipByGuid(this.membershipGuid)
      .pipe(take(1))
      .subscribe((siteMembership: SiteMembership): void => {
        if (!siteMembership) {
          this.onCloseIntent();
          return;
        }
        this.siteMembership$.next(siteMembership);
        this.initialized$.next(true);
      });

    if (this.upgradeMode) {
      this.siteMembershipSubscriptionsSubscription =
        this.siteMembershipsService.siteMembershipSubscriptions$
          .pipe(take(1))
          .subscribe(
            (
              siteMembershipSubscriptions: SiteMembershipSubscription[]
            ): void => {
              for (let siteMembershipSubscription of siteMembershipSubscriptions) {
                /**
                 * If this error shows in a permission intent context, it is likely that
                 * permissions have been misconfigured - for example an intent is triggering
                 * a modal for a membership that does not grant the given permission.
                 */
                if (
                  siteMembershipSubscription.membershipGuid ===
                  this.membershipGuid
                ) {
                  console.error(
                    'Showed single site membership modal for a membership that the user is already a member of.'
                  );
                  this.toaster.warn(
                    'You are already a member. Please contact an administrator.'
                  );
                  this.onCloseIntent();
                  break;
                }
              }
            }
          );
    }
  }

  ngOnDestroy(): void {
    this.loadMembershipSubscription?.unsubscribe();
    this.siteMembershipSubscriptionsSubscription?.unsubscribe();
  }

  /**
   * Set modal data.
   * @param { SingleSiteMembershipModalData } data - data for modal.
   * @returns { void }
   */
  public setModalData({
    title,
    subtitle,
    closeCtaText,
    membershipGuid,
    upgradeMode,
    onJoinIntent,
    onCloseIntent,
  }: SingleSiteMembershipModalData): void {
    this.title = title;
    this.subtitle = subtitle;
    this.closeCtaText = closeCtaText;
    this.membershipGuid = membershipGuid;
    this.upgradeMode = upgradeMode ?? true;
    this.onJoinIntent = onJoinIntent ?? (() => {});
    this.onCloseIntent = onCloseIntent ?? (() => {});
  }
}
