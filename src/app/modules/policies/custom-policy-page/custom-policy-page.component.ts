import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MultiTenantNetworkConfigService } from '../../multi-tenant-network/services/config.service';
import { CustomPolicyId } from '../policies.types';
import { BehaviorSubject, Subscription, filter, take } from 'rxjs';
import { MultiTenantConfig } from '../../../../graphql/generated.engine';

/**
 * Presents simple policy pages on tenant sites.
 * Used when the tenant owner has opted to use custom policy text.
 * (e.g. privacy, tos, community guidelines)
 */

@Component({
  selector: 'm-customPolicyPage',
  templateUrl: './custom-policy-page.component.html',
  styleUrls: ['./custom-policy-page.component.ng.scss'],
})
export class CustomPolicyPageComponent implements OnInit, OnDestroy {
  /**
   * the id of the policy we're displaying
   * */
  protected policyId: CustomPolicyId;

  /**
   * the text of the policy we're displaying
   * */
  protected policyText: string;

  subscriptions: Subscription[] = [];

  /** Whether loading is in progress. */
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  /**
   * Allows us to use enum in the template
   */
  public CustomPolicyId: typeof CustomPolicyId = CustomPolicyId;

  constructor(
    private multiTenantConfigService: MultiTenantNetworkConfigService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.policyId = this.route.snapshot.data['policyId'];

    if (!this.policyId) {
      this.loading$.next(false);
      return;
    }

    // setup initial form values based on server response / defaults.
    this.subscriptions.push(
      this.multiTenantConfigService.config$
        .pipe(filter(Boolean), take(1))
        .subscribe((config: MultiTenantConfig): void => {
          this.getPolicyText(config);
          this.loading$.next(false);
        })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private getPolicyText(config: MultiTenantConfig): void {
    switch (this.policyId) {
      case CustomPolicyId.PRIVACY:
        this.policyText = config.privacyPolicy;
      case CustomPolicyId.TERMS_OF_SERVICE:
        this.policyText = config.termsOfService;
      case CustomPolicyId.COMMUNITY_GUIDELINES:
        this.policyText = config.communityGuidelines;
      default:
        this.policyText = null;
    }
  }
}
