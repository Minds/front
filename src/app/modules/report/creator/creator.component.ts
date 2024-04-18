import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';
import { ToasterService } from '../../../common/services/toaster.service';
import { ModalService } from '../../../services/ux/modal.service';
import { MindsUser } from '../../../interfaces/entities';
import { ReportService } from './../../../common/services/report.service';
import { PlusTierUrnService } from '../../../common/services/plus-tier-urn.service';
import {
  CreateReportMutationReasonEnums,
  GraphQLReportCreatorService,
} from './services/graphql-report-creator.service';
import { IS_TENANT_NETWORK } from '../../../common/injection-tokens/tenant-injection-tokens';
import { WINDOW } from '../../../common/injection-tokens/common-injection-tokens';

/**
 * Modal for creating reports of content policy violations
 *
 * See it by clicking "report post" from the meatball menu of an activity post that is not your own
 */
@Component({
  moduleId: module.id,
  selector: 'm-report--creator',
  templateUrl: 'creator.component.html',
  styleUrls: ['./creator.component.ng.scss'],
})
export class ReportCreatorComponent implements AfterViewInit {
  subject = {
    value: null,
    hasMore: false,
    label: '',
    description: '',
  };
  subReason = {
    value: null,
    label: '',
    description: '',
  };

  note: string = '';
  guid: string = '';

  /** URN of the entity being reported. */
  private urn: string = '';

  initialized: boolean = false;
  inProgress: boolean = false;

  success: boolean = false;
  error: string = '';
  subjects: any[];

  next: boolean = false;

  _opts: any;

  constructor(
    public session: Session,
    private _changeDetectorRef: ChangeDetectorRef,
    private modalService: ModalService,
    private client: Client,
    protected toasterService: ToasterService,
    private reportService: ReportService,
    private plusTierUrn: PlusTierUrnService,
    private graphQLReportCreatorService: GraphQLReportCreatorService,
    @Inject(WINDOW) private window: Window,
    @Inject(IS_TENANT_NETWORK) public readonly isTenantNetwork: boolean
  ) {}

  setModalData(opts: {
    entity: MindsUser | any;
    onReported?: (guid: number, reason?: number, subreason?: number) => void;
  }) {
    this._opts = opts;
    this.guid = opts.entity ? opts.entity.guid : null;
    this.urn = opts?.entity?.urn ?? null;

    const supportTierUrn: string =
      opts.entity?.wire_threshold?.support_tier?.urn;
    this.subjects = this.reportService.reasons.filter((reason) => {
      return (
        reason.value !== 18 ||
        (supportTierUrn && this.plusTierUrn.isPlusTierUrn(supportTierUrn))
      );
    });
  }

  ngAfterViewInit() {
    this._changeDetectorRef.detectChanges();
  }

  /**
   * Validates if the report can be submitted using the current settings
   */
  validate() {
    if (!this.subject) {
      return false;
      //throw new Error('You cannot report this.');
    }
    if (this.subject.hasMore && this.next && !this.subReason.value) {
      return false;
    }
    return true;
  }

  /**
   * Checks if the user can submit using the current settings
   */
  canSubmit() {
    try {
      return this.validate();
    } catch (e) {
      return false;
    }
  }

  /**
   * Shows visible report errors
   */
  showErrors() {
    this.error = '';

    try {
      this.validate();
    } catch (e) {
      this.error = e.message;
      if (!this.inProgress) {
        this.toasterService.error(this.error);
      }
    }
  }

  setSubject(subject) {
    this.subject = subject;
  }

  setSubReason(reason) {
    this.subReason = reason;
  }

  close() {
    this.modalService.dismissAll();
  }

  /**
   * Submits the report to the appropiate server endpoint using the current settings
   */
  async submit() {
    if (this.isTenantNetwork) {
      this.handleTenantReportSubmission();
      return;
    }

    if (
      this.isAdmin &&
      !confirm('Warning: This action is being run as admin - proceed?')
    ) {
      this.toasterService.inform('Action cancelled');
      return;
    }

    this.inProgress = true;

    try {
      let response: any = await this.client.post(`api/v2/moderation/report`, {
        entity_guid: this.guid,
        entity_urn: this.urn,
        reason_code: this.subject.value,
        note: this.note,
        sub_reason_code: this.subReason.value,
      });

      this.inProgress = false;
      this.success = true;

      if (this.session.isAdmin()) {
        this.close();
      }

      this._opts?.onReported?.(
        this.guid,
        this.subject.value,
        this.subReason.value
      );
    } catch (e) {
      this.inProgress = false;
      //this.overlayModal.dismiss();\
      this.toasterService.error('There was an error sending your report.');
      this.toasterService.error(e.message ? e.message : e);
    }
  }

  /**
   * Gets category name for footer.
   * @returns { string } - category name.
   */
  public getFooterCategoryName(): string {
    if (this.subReason?.label) {
      return this.subReason.label;
    }
    if (this.subject?.label) {
      return this.subject.label;
    }
    return $localize`:@@REPORT_CREATOR__REPORT_REASONS:Report Reasons`;
  }

  /**
   * Gets category description for footer.
   * @returns { string } - category description.
   */
  public getFooterCategoryDescription(): string {
    if (this.subReason?.description) {
      return this.subReason.description;
    }
    if (this.subject?.description) {
      return this.subject.description;
    }
    if (this.subject?.hasMore) {
      return $localize`:@@REPORT_CREATOR__SUB_REASON_SELECT:Select a sub-reason to complete your report`;
    }
    return $localize`:@@REPORT_CREATOR__REASON_SELECT:Select a reason above to complete your report`;
  }

  /**
   * Whether or not user is logged in via an admin session.
   * @returns { boolean } - true if logged in user is admin.
   */
  get isAdmin(): boolean {
    return this.session.isAdmin();
  }

  /**
   * Opens a new tab for DMCA report submission.
   * @returns { void }
   */
  public openDmcaLink(): void {
    this.window.open('/p/dmca', '_blank');
    this.close();
  }

  /**
   * Handle report submissions for tenant networks.
   * @returns { Promise<void> }
   */
  private async handleTenantReportSubmission(): Promise<void> {
    this.inProgress = true;

    const reasonEnums: CreateReportMutationReasonEnums =
      this.graphQLReportCreatorService.mapLegacyReasonToEnums(
        this.subject.value,
        this.subReason.value
      );

    const success: boolean =
      await this.graphQLReportCreatorService.createNewReport({
        entityUrn: this.urn,
        ...reasonEnums,
      });

    this.inProgress = false;

    if (!success) {
      return;
    }

    if (this.session.isAdmin()) {
      this.close();
    }

    this.success = true;

    this._opts?.onReported?.(
      this.guid,
      this.subject.value,
      this.subReason.value
    );
  }
}
