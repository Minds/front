import { Injectable } from '@angular/core';
import {
  IllegalSubReasonEnum,
  NsfwSubReasonEnum,
  Report,
  ReportReasonEnum,
  SecuritySubReasonEnum,
} from '../../../../../../../../graphql/generated.engine';

/**
 * Utilities class for reports
 */
@Injectable({ providedIn: 'root' })
export class ReportUtilitiesService {
  /**
   * Gets reason label for a given report.
   * @param { Report } report - report to get label for.
   * @returns { string } label.
   */
  public getReasonLabelFromReport(report: Report): string {
    let reason: string = '';
    let subReason: string = '';
    switch (report.reason) {
      case ReportReasonEnum.Nsfw:
        reason = $localize`:@@REPORT_REASON__NSFW:NSFW`;
        subReason = this.getNsfwSubReasonLabel(report.nsfwSubReason);
        if (subReason) {
          reason += ` (${subReason})`;
        }
        return reason;
      case ReportReasonEnum.Illegal:
        reason = $localize`:@@REPORT_REASON__Illegal:Illegal`;
        subReason = this.getIllegalSubReasonLabel(report.illegalSubReason);
        if (subReason) {
          reason += ` (${subReason})`;
        }
        return reason;
      case ReportReasonEnum.Security:
        reason = $localize`:@@REPORT_REASON__Security:Security`;
        subReason = this.getSecuritySubReasonLabel(report.securitySubReason);
        if (subReason) {
          reason += ` (${subReason})`;
        }
        return reason;
      case ReportReasonEnum.Harassment:
        return $localize`:@@REPORT_REASON__Harassment:Harassment`;
      case ReportReasonEnum.Impersonation:
        return $localize`:@@REPORT_REASON__Impersonation:Impersonation`;
      case ReportReasonEnum.InauthenticEngagement:
        return $localize`:@@REPORT_REASON__InauthenticEngagement:Inauthentic engagement`;
      case ReportReasonEnum.IncitementToViolence:
        return $localize`:@@REPORT_REASON__IncitementToViolence:Incitement to violence`;
      case ReportReasonEnum.IntellectualPropertyViolation:
        return $localize`:@@REPORT_REASON__IntellectualPropertyViolation:Intellectual property violation`;
      case ReportReasonEnum.Malware:
        return $localize`:@@REPORT_REASON__Malware:Malware`;
      case ReportReasonEnum.PersonalConfidentialInformation:
        return $localize`:@@REPORT_REASON__PersonalConfidentialInformation:Personal/confidential information`;
      case ReportReasonEnum.Spam:
        return $localize`:@@REPORT_REASON__Spam:Spam`;
      case ReportReasonEnum.ActivityPubReport:
        return $localize`:@@REPORT_REASON__ActivityPubReport:ActivityPub report`;
      case ReportReasonEnum.ViolatesPremiumContentPolicy:
        return $localize`:@@REPORT_REASON__ViolatesPremiumContentPolicy:Violates premium content policy`;
      default:
        return $localize`:@@REPORT_REASON__OtherReason:Other reason`;
    }
  }

  /**
   * Gets NSFW subreason label by enum value.
   * @param { NsfwSubReasonEnum } subReason - subreason to get label for.
   * @returns { string } label.
   */
  private getNsfwSubReasonLabel(subReason: NsfwSubReasonEnum): string {
    switch (subReason) {
      case NsfwSubReasonEnum.Nudity:
        return $localize`:@@REPORT_REASON__NSFW_SUB_REASON__Nudity:Nudity`;
      case NsfwSubReasonEnum.Pornography:
        return $localize`:@@REPORT_REASON__NSFW_SUB_REASON__Pornography:Pornography`;
      case NsfwSubReasonEnum.Profanity:
        return $localize`:@@REPORT_REASON__NSFW_SUB_REASON__Profanity:Profanity`;
      case NsfwSubReasonEnum.RaceReligionGender:
        return $localize`:@@REPORT_REASON__NSFW_SUB_REASON__RaceReligionGender:Race, religion or gender`;
      case NsfwSubReasonEnum.ViolenceGore:
        return $localize`:@@REPORT_REASON__NSFW_SUB_REASON__ViolenceGore:Violence or gore`;
    }
  }

  /**
   * Gets Illegal subreason label by enum value.
   * @param { IllegalSubReasonEnum } subReason - subreason to get label for.
   * @returns { string } label.
   */
  private getIllegalSubReasonLabel(subReason: IllegalSubReasonEnum): string {
    switch (subReason) {
      case IllegalSubReasonEnum.AnimalAbuse:
        return $localize`:@@REPORT_REASON__ILLEGAL_SUB_REASON__AnimalAbuse:Animal abuse`;
      case IllegalSubReasonEnum.Extortion:
        return $localize`:@@REPORT_REASON__ILLEGAL_SUB_REASON__Extortion:Extortion`;
      case IllegalSubReasonEnum.Fraud:
        return $localize`:@@REPORT_REASON__ILLEGAL_SUB_REASON__Fraud:Fraud`;
      case IllegalSubReasonEnum.MinorsSexualization:
        return $localize`:@@REPORT_REASON__ILLEGAL_SUB_REASON__MinorsSexualization:Sexualization of minors`;
      case IllegalSubReasonEnum.RevengePorn:
        return $localize`:@@REPORT_REASON__ILLEGAL_SUB_REASON__RevengePorn:Revenge porn`;
      case IllegalSubReasonEnum.Terrorism:
        return $localize`:@@REPORT_REASON__ILLEGAL_SUB_REASON__Terrorism:Terrorism`;
      case IllegalSubReasonEnum.Trafficking:
        return $localize`:@@REPORT_REASON__ILLEGAL_SUB_REASON__Trafficking:Trafficking`;
    }
  }

  /**
   * Gets Security subreason label by enum value.
   * @param { SecuritySubReasonEnum } subReason - subreason to get label for.
   * @returns { string } label.
   */
  private getSecuritySubReasonLabel(subReason: SecuritySubReasonEnum): string {
    switch (subReason) {
      case SecuritySubReasonEnum.HackedAccount:
        return $localize`:@@REPORT_REASON__SECURITY_SUB_REASON__HackedAccount:Hacked account`;
    }
  }
}
