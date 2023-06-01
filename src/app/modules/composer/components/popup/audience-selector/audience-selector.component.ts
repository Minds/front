import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  ActivityContainer,
  ComposerAudienceSelectorService,
} from '../../../services/audience.service';
import { Session } from '../../../../../services/session';
import { MindsUser } from '../../../../../interfaces/entities';
import { ComposerModalService } from '../../modal/modal.service';
import { Router } from '@angular/router';

/**
 * Composer audience selector panel.
 */
@Component({
  selector: 'm-composer__audienceSelectorPanel',
  templateUrl: 'audience-selector.component.html',
  styleUrls: ['./audience-selector.component.ng.scss'],
})
export class ComposerAudienceSelectorPanelComponent implements OnInit {
  /** Signal event emitter to parent's popup service. */
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  /** Currently selected audience. */
  public readonly selectedAudience$: BehaviorSubject<ActivityContainer> = this
    .audienceSelectorService.selectedAudience$;

  /** Whether panels groups section is expanded. */
  public readonly groupsExpanded$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  /** List of groups from service. */
  public readonly groups$: Observable<any[]> = this.audienceSelectorService
    .groups$;

  /** Whether groups are currently loading. */
  public readonly groupsLoadInProgress$: Observable<boolean> = this
    .audienceSelectorService.groupsLoadInProgress$;

  /** Whether there are more groups to load. */
  public readonly groupsHasNext$: Observable<boolean> = this
    .audienceSelectorService.groupsHasNext$;

  public loggedInUser: MindsUser = null;

  constructor(
    private router: Router,
    private composerModalService: ComposerModalService,
    private audienceSelectorService: ComposerAudienceSelectorService,
    private session: Session
  ) {}

  ngOnInit(): void {
    this.loggedInUser = this.session.getLoggedInUser();
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
}
