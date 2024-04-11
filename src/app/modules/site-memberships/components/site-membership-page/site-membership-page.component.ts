import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SiteMembership } from '../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../common/services/toaster.service';
import { SiteMembershipService } from '../../services/site-memberships.service';

/**
 * Display a single site membership
 */
@Component({
  selector: 'm-siteMembershipPage',
  templateUrl: './site-membership-page.component.html',
  styleUrls: ['./site-membership-page.component.ng.scss'],
})
export class SiteMembershipPageComponent implements OnInit {
  membership$: Observable<SiteMembership | null>;

  protected starCardTitle$: Observable<string>;

  public isMember$: Observable<boolean>;

  public membershipGuid: string;

  protected subscriptions: Subscription[] = [];
  constructor(
    private route: ActivatedRoute,
    private toasterService: ToasterService,
    private router: Router,
    private siteMembershipsService: SiteMembershipService
  ) {}

  ngOnInit(): void {
    this.siteMembershipsService.fetch();
    this.isMember$ =
      this.siteMembershipsService.siteMembershipSubscriptionGuids$.pipe(
        map((guids) => guids.includes(this.membershipGuid))
      );

    this.membership$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.membershipGuid = params.get('membershipGuid');
        if (!this.membershipGuid) {
          this.toasterService.error('Membership guid not provided');
          this.router.navigate(['/memberships']);
          return of(null);
        }
        return this.siteMembershipsService.loadMembershipByGuid(
          this.membershipGuid
        );
      }),
      catchError((error) => {
        this.toasterService.error('Failed to load membership details');
        this.redirectToMembershipsPage();
        return of(null);
      })
    );

    this.starCardTitle$ = this.membership$.pipe(
      map((membership) => {
        if (membership.archived) {
          this.redirectToMembershipsPage();
        }
        if (!membership) return '';
        return $localize`:@@SITE_MEMBERSHIP_PAGE_TITLE__YOURE_INVITED_TO:You're invited to ${membership.membershipName}`;
      })
    );
  }

  redirectToMembershipsPage() {
    this.router.navigate(['/memberships'], {
      queryParams: { membershipRedirect: 'true' },
    });
  }
}
