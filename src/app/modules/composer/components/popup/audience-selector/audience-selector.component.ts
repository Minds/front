import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import {
  ActivityContainer,
  ComposerAudienceSelectorService,
} from '../../../services/audience.service';
import { Session } from '../../../../../services/session';
import { MindsUser } from '../../../../../interfaces/entities';
import { ComposerModalService } from '../../modal/modal.service';
import { Router } from '@angular/router';
import {
  SelectableEntity,
  SelectableMonetization,
} from '../../../../../common/components/selectable-entity-card/selectable-entity-card.component';
import { ComposerMonetizeV2Service } from '../monetize/v2/components/monetize.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import { ComposerService } from '../../../services/composer.service';
import {
  SupportTier,
  SupportTiersService,
} from '../../../../wire/v2/support-tiers.service';

/**
 * Composer audience selector panel.
 * Select to post to your channel or a group,
 * or select monetization (Minds+ or memberships)
 */
@Component({
  selector: 'm-composer__audienceSelectorPanel',
  templateUrl: 'audience-selector.component.html',
  styleUrls: ['./audience-selector.component.ng.scss'],
  providers: [SupportTiersService, ComposerMonetizeV2Service],
})
export class ComposerAudienceSelectorPanelComponent
  implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  /** Signal event emitter to parent's popup service. */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  /** Currently selected audience. */
  public readonly selectedAudience$: BehaviorSubject<ActivityContainer> = this
    .audienceSelectorService.selectedAudience$;

  /** Currently selected monetization. */
  public readonly selectedMonetization$ = this.composerService
    .pendingMonetization$;

  /** Currently logged in user. */
  public loggedInUser: MindsUser = null;

  /**
   * When share to group mode is enabled, a quote post is
   * created to share to the selected group.
   *
   * This value is used to prevent a channel from being
   * selected and changes various parts of the template to provide clearer context.
   */
  public readonly shareToGroupMode$: Observable<boolean> = this
    .audienceSelectorService.shareToGroupMode$;

  private readonly plusTierUrn: string;

  // -----------------------------------------------
  // GROUPS

  /** Whether panels groups section is expanded. */
  public readonly groupsExpanded$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(true);

  /** List of groups held in local state. */
  public readonly groups$: BehaviorSubject<
    SelectableEntity[]
  > = new BehaviorSubject<SelectableEntity[]>([]);

  /** Whether groups are currently loading. */
  public readonly groupsLoading$: Observable<boolean> = this
    .audienceSelectorService.groupsLoading$;

  /** Whether there are more groups to load. */
  public readonly groupsHasNext$: Observable<boolean> = this
    .audienceSelectorService.groupsHasNext$;

  // -----------------------------------------------
  // MEMBERSHIPS

  /** Whether panels membership section is expanded. */
  public readonly membershipsExpanded$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** Whether memberships have been loaded yet.
   */
  public readonly membershipsLoaded$: Observable<boolean> = this.monetizeService
    .loaded$;

  public readonly hasMemberships$: Observable<
    boolean
  > = this.monetizeService.supportTiers$.pipe(
    map(supportTiers => {
      return supportTiers.length > 0;
    })
  );

  /** List of memberships */
  public readonly memberships$: Observable<SupportTier[]> = this.monetizeService
    .supportTiers$;

  constructor(
    private router: Router,
    private composerModalService: ComposerModalService,
    private audienceSelectorService: ComposerAudienceSelectorService,
    private monetizeService: ComposerMonetizeV2Service,
    private composerService: ComposerService,
    private session: Session,
    configs: ConfigsService
  ) {
    this.plusTierUrn =
      configs.get('plus').support_tier_urn || 'urn:support-tier:plus';
  }

  ngOnInit(): void {
    this.loggedInUser = this.session.getLoggedInUser();

    this.subscriptions.push(
      this.audienceSelectorService.groupsPage$.subscribe(
        (groups: SelectableEntity[]): void => {
          if (groups && groups.length) {
            this.groups$.next([...this.groups$.getValue(), ...groups]);
          }
        }
      ),
      this.membershipsLoaded$.subscribe(loaded => {
        if (!loaded) {
          this.monetizeService.loadSupportTiers(this.loggedInUser.guid);
        }
      })
    );
  }

  ngOnDestroy(): void {
    for (let subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.audienceSelectorService.reset();
  }

  /**
   * Emits the internal state to the composer service and attempts to dismiss the modal.
   * @returns { void }
   */
  public save(): void {
    this.dismissIntent.emit();
  }

  /**
   * Fires on entity select.
   * @returns { void }
   */
  public onEntitySelect(entity: ActivityContainer): void {
    this.audienceSelectorService.selectedAudience$.next(entity);
  }

  /**
   * Fires on monetization select.
   * @returns { void }
   */
  public onMonetizationSelect(monetization: SelectableMonetization): void {
    this.composerService.pendingMonetization$.next({
      type: monetization === 'plus' ? 'plus' : 'membership',
      name: monetization === 'plus' ? 'Minds+' : monetization.name,
      support_tier: {
        urn: monetization === 'plus' ? this.plusTierUrn : monetization.urn,
      },
    });
  }

  /**
   * Fires on memberships expand / collapse.
   * @returns { void }
   */
  public toggleMembershipsExpand(): void {
    this.membershipsExpanded$.next(!this.membershipsExpanded$.getValue());
    this.subscriptions.push(
      this.membershipsLoaded$.subscribe(loaded => {
        if (!loaded) {
          this.monetizeService.loadSupportTiers(this.loggedInUser.guid);
        }
      })
    );
  }

  /**
   * Fires on groups expand / collapse.
   * @returns { void }
   */
  public toggleGroupsExpand(): void {
    this.groupsExpanded$.next(!this.groupsExpanded$.getValue());
  }

  /**
   * Triggers the loading of the next batch of groups.
   * @returns { void }
   */
  public loadNextGroups(): void {
    this.audienceSelectorService.loadNextGroups();
  }

  /**
   * Force dismiss composer and navigate to groups suggestion page.
   * @returns { void }
   */
  public onDiscoverGroupsClick(): void {
    this.composerModalService.dismiss();
    this.router.navigate(['/discovery/suggestions/group']);
  }

  /**
   * Force dismiss composer and navigate to groups suggestion page.
   * @returns { void }
   */
  public onSetupMembershipsClick(): void {
    this.composerModalService.dismiss();
    this.router.navigate(['/settings/other/subscription-tiers']);
  }
}
