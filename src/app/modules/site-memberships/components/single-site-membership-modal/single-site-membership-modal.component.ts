import { Component, OnDestroy, OnInit } from '@angular/core';
import { SiteMembership } from '../../../../../graphql/generated.engine';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { SiteMembershipService } from '../../services/site-memberships.service';

/** Data for single site membership modal. */
export type SingleSiteMembershipModalData = {
  title: string;
  subtitle: string;
  closeCtaText: string;
  membershipGuid: string;
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
  /** Whether component can be consider as initialized. */
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

  /** Subscription to load membership. */
  private loadMembershipSubscription: Subscription;

  /**
   * Dismiss intent.
   */
  onJoinIntent: () => void = () => {};

  /**
   * Dismiss intent.
   */
  onCloseIntent: () => void = () => {};

  constructor(private siteMembershipsService: SiteMembershipService) {}

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
  }

  ngOnDestroy(): void {
    this.loadMembershipSubscription?.unsubscribe();
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
    onJoinIntent,
    onCloseIntent,
  }: SingleSiteMembershipModalData): void {
    this.title = title;
    this.subtitle = subtitle;
    this.closeCtaText = closeCtaText;
    this.membershipGuid = membershipGuid;
    this.onJoinIntent = onJoinIntent ?? (() => {});
    this.onCloseIntent = onCloseIntent ?? (() => {});
  }
}
