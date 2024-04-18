import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ProvideVerdictGQL,
  ProvideVerdictMutation,
  ReportActionEnum,
  ReportEdge,
  UserNode,
} from '../../../../../../../../graphql/generated.engine';
import { ReportUtilitiesService } from '../services/report-utilities.service';
import { ActivityService } from '../../../../../../../common/services/activity.service';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  of,
  take,
} from 'rxjs';
import { MutationResult } from 'apollo-angular';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { AbstractSubscriberComponent } from '../../../../../../../common/components/abstract-subscriber/abstract-subscriber.component';

/**
 * Component that displays a single report with its actions and entity.
 */
@Component({
  selector: 'm-networkAdminConsole__report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.ng.scss'],
  providers: [ActivityService],
})
export class NetworkAdminConsoleReportComponent extends AbstractSubscriberComponent {
  /** Report egde to display. */
  @Input() public reportEdge: ReportEdge;

  /** Emits when a verdict has been provided for a report. */
  @Output() public verdictProvided: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  /** Whether an action is currently in progress for the report. */
  public readonly actionInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private reportUtilitiesService: ReportUtilitiesService,
    private provideVerdictGql: ProvideVerdictGQL,
    private toaster: ToasterService,
    private router: Router
  ) {
    super();
  }

  /**
   * Parse legacy entity json into an object.
   * @param { string } legacyEntityJson
   * @returns { Object } parsed object.
   */
  public parseLegacyEntityJson(legacyEntityJson: string): Object {
    try {
      return JSON.parse(legacyEntityJson);
    } catch (e) {
      return null;
    }
  }

  /**
   * Navigate to a channel.
   * @param { MouseEvent } $event - mouse event.
   * @param { string } username - username of the channel to navigate to.
   * @returns { void }
   */
  public navigateToChannel($event: MouseEvent, username: string): void {
    // middle mouse click.
    if ($event.button === 1) {
      window.open(`/${username}`, '_blank');
      return;
    }
    this.router.navigate([`/${username}`]);
  }

  /**
   * On delete button click, update server and emit on success.
   * @returns { void }
   */
  public deleteButtonClick(): void {
    this.actionInProgress$.next(true);

    this.subscriptions.push(
      this.provideVerdictGql
        .mutate({
          reportGuid: this.reportEdge.node.reportGuid,
          action: ReportActionEnum.Delete,
        })
        .pipe(
          take(1),
          catchError((e: unknown): Observable<null> => {
            console.error(e);
            return of(null);
          }),
          finalize(() => this.actionInProgress$.next(false))
        )
        .subscribe(
          (result: MutationResult<ProvideVerdictMutation>): boolean => {
            if (
              !result ||
              result.errors?.length ||
              !result.data?.provideVerdict
            ) {
              if (result?.errors) {
                console.error(result.errors);
              }
              this.showDeleteErrorToast();
              return;
            }
            this.showDeleteSuccessToast();
            this.verdictProvided.emit(true);
          }
        )
    );
  }

  /**
   * On ban button click, update server and emit on success.
   * @returns { void }
   */
  public banButtonClick(): void {
    this.actionInProgress$.next(true);

    this.subscriptions.push(
      this.provideVerdictGql
        .mutate({
          reportGuid: this.reportEdge.node.reportGuid,
          action: ReportActionEnum.Ban,
        })
        .pipe(
          take(1),
          catchError((e: unknown): Observable<null> => {
            console.error(e);
            return of(null);
          }),
          finalize(() => this.actionInProgress$.next(false))
        )
        .subscribe(
          (result: MutationResult<ProvideVerdictMutation>): boolean => {
            if (
              !result ||
              result.errors?.length ||
              !result.data?.provideVerdict
            ) {
              if (result?.errors) {
                console.error(result.errors);
              }
              this.toaster.error(
                $localize`:@@REPORT_V2__VERDICT_PROVIDED__ERROR_BANNING_USER:There was an error when banning this user`
              );
              return;
            }
            this.toaster.success(
              $localize`:@@REPORT_V2__VERDICT_PROVIDED__USER_BANNED:User banned`
            );
            this.verdictProvided.emit(true);
          }
        )
    );
  }

  /**
   * On ignore button click, update server and emit on success.
   * @returns { void }
   */
  public ignoreButtonClick(): void {
    this.actionInProgress$.next(true);

    this.subscriptions.push(
      this.provideVerdictGql
        .mutate({
          reportGuid: this.reportEdge.node.reportGuid,
          action: ReportActionEnum.Ignore,
        })
        .pipe(
          take(1),
          catchError((e: unknown): Observable<null> => {
            console.error(e);
            return of(null);
          }),
          finalize(() => this.actionInProgress$.next(false))
        )
        .subscribe(
          (result: MutationResult<ProvideVerdictMutation>): boolean => {
            if (
              !result ||
              result.errors?.length ||
              !result.data?.provideVerdict
            ) {
              if (result?.errors) {
                console.error(result.errors);
              }
              this.toaster.error(
                $localize`:@@REPORT_V2__VERDICT_PROVIDED__UNABLE_TO_IGNORE_REPORT:There was an error ignoring this report`
              );
              return;
            }
            this.toaster.inform(
              $localize`:@@REPORT_V2__VERDICT_PROVIDED__REPORT_IGNORED:Report ignored`
            );
            this.verdictProvided.emit(true);
          }
        )
    );
  }

  /**
   * Gets reason label.
   * @returns { string } reason label.
   */
  public get reasonLabel(): string {
    return this.reportUtilitiesService.getReasonLabelFromReport(
      this.reportEdge.node
    );
  }

  /**
   * Whether delete button should be shown.
   * @returns { boolean } whether delete button should be shown.
   */
  public get shouldShowDeleteButton(): boolean {
    return this.reportEdge.node.entityEdge.node.__typename !== 'UserNode';
  }

  /**
   * Whether ban button should be shown.
   * @returns { boolean } whether ban button should be shown.
   */
  public get shouldShowBanButton(): boolean {
    return this.reportEdge.node.entityEdge.node.__typename !== 'GroupNode';
  }

  /**
   * Gets parsed entity object.
   * @returns { Object } parsed entity object.
   */
  public get entity(): Object {
    return this.reportEdge?.node?.entityEdge?.node?.legacy
      ? this.parseLegacyEntityJson(
          this.reportEdge?.node?.entityEdge?.node?.legacy
        )
      : null;
  }

  /**
   * Gets reportedBy user.
   * @returns { UserNode } user who reported.
   */
  public get reportedByUser(): UserNode {
    return this.reportEdge?.node?.reportedByUserEdge?.node;
  }

  public get deletePostButtonText(): string {
    switch (this.reportEdge.node.entityEdge.node.__typename) {
      case 'ActivityNode':
        return $localize`:@@REPORT_V2__ACTION_BAR__DELETE_ACTIVITY_POST:Delete activity post`;
      case 'CommentNode':
        return $localize`:@@REPORT_V2__ACTION_BAR__DELETE_COMMENT:Delete comment`;
      case 'GroupNode':
        return $localize`:@@REPORT_V2__ACTION_BAR__DELETE_GROUP:Delete group`;
      default:
        return $localize`:@@REPORT_V2__ACTION_BAR__DELETE:Delete`;
    }
  }

  /**
   * Get ban button text.
   * @returns { string } ban button text.
   */
  public get banButtonText(): string {
    switch (this.reportEdge.node.entityEdge.node.__typename) {
      case 'ActivityNode':
      case 'CommentNode':
      case 'UserNode':
        return $localize`:@@REPORT_V2__ACTION_BAR__BAN_USER:Ban user`;
      default:
        return $localize`:@@REPORT_V2__ACTION_BAR__BAN:Ban`;
    }
  }

  /**
   * Show toast for deletion success.
   * @returns { void }
   */
  private showDeleteSuccessToast(): void {
    switch (this.reportEdge.node.entityEdge.node.__typename) {
      case 'ActivityNode':
        this.toaster.success(
          $localize`:@@REPORT_V2__VERDICT_PROVIDED__POST_DELETED:Post deleted`
        );
        break;
      case 'CommentNode':
        this.toaster.success(
          $localize`:@@REPORT_V2__VERDICT_PROVIDED__COMMENT_DELETED:Comment deleted`
        );
        break;
      case 'GroupNode':
        this.toaster.success(
          $localize`:@@REPORT_V2__VERDICT_PROVIDED__GROUP_DELETED:Group deleted`
        );
        break;
      default:
        this.toaster.success(
          $localize`:@@REPORT_V2__VERDICT_PROVIDED__ENTITY_DELETED:Entity deleted`
        );
        break;
    }
  }

  /**
   * Show toast for a deletion error.
   * @returns { void }
   */
  private showDeleteErrorToast(): void {
    switch (this.reportEdge.node.entityEdge.node.__typename) {
      case 'ActivityNode':
        this.toaster.error(
          $localize`:@@REPORT_V2__VERDICT_PROVIDED__ERROR_DELETING_ACTIVITY:There was an error when deleting this post`
        );
        break;
      case 'CommentNode':
        this.toaster.error(
          $localize`:@@REPORT_V2__VERDICT_PROVIDED__ERROR_DELETING_COMMENT:There was an error when deleting this comment`
        );
        break;
      case 'GroupNode':
        this.toaster.error(
          $localize`:@@REPORT_V2__VERDICT_PROVIDED__ERROR_DELETING_GROUP:There was an error when deleting this group`
        );
        break;
      default:
        this.toaster.error(
          $localize`:@@REPORT_V2__VERDICT_PROVIDED__ERROR_DELETING:There was an error when deleting this entity`
        );
        break;
    }
  }
}
