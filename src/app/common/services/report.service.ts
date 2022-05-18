import { ConfigsService } from './configs.service';
import { Injectable } from '@angular/core';

export type Reason = {
  label: string;
  reasons?: Reason[];
  description?: string;
  value: number;
  hasMore: boolean;
};

/**
 * a simple class to manage reports and their translations
 */
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private configs: ConfigsService) {}

  /**
   * returns reasons with localized texts
   */
  get reasons(): Reason[] {
    return this.configs
      .get('report_reasons')
      .map(reason => this.localizeReason(reason));
  }

  private localizeReason = (reason: Reason, parentId?: string) => {
    let label = reason.label;
    let description = '';
    let reasons;
    const id = parentId ? `${parentId}.${reason.value}` : String(reason.value);

    switch (id) {
      case '1':
        label = $localize`:@@REPORT__1:Illegal`;
        break;
      case '1.1':
        label = $localize`:@@REPORT__1.1:Terrorism`;
        description = $localize`:@@REPORT_DESCRIPTION__1.1:Advertizing or recruiting for terrorist organizations`;
        break;
      case '1.2':
        label = $localize`:@@REPORT__1.2:Sexualization of minors`;
        description = $localize`:@@REPORT_DESCRIPTION__1.2:Implies or promotes child sexual activity or shows genitalia`;
        break;
      case '1.3':
        label = $localize`:@@REPORT__1.3:Extortion`;
        description = $localize`:@@REPORT_DESCRIPTION__1.3:Material that aims to achieve a benefit through coercion`;
        break;
      case '1.4':
        label = $localize`:@@REPORT__1.4:Fraud`;
        description = $localize`:@@REPORT_DESCRIPTION__1.4:Intent to deceive someone for monetary or personal gain`;
        break;
      case '1.5':
        label = $localize`:@@REPORT__1.5:Revenge Porn`;
        description = $localize`:@@REPORT_DESCRIPTION__1.5:Distribution of pornographic materials without consent`;
        break;
      case '1.6':
        label = $localize`:@@REPORT__1.6:Trafficking`;
        description = $localize`:@@REPORT_DESCRIPTION__1.6:Illegal sales of sex or paraphernalia (e.g. escort services, drugs)`;
        break;
      case '2':
        label = $localize`:@@REPORT__2:NSFW (not safe for work)`;
        break;
      case '2.1':
        label = $localize`:@@REPORT__2.1:Nudity`;
        description = $localize`:@@REPORT_DESCRIPTION__2.1:Exposure of genitalia or breasts`;
        break;
      case '2.2':
        label = $localize`:@@REPORT__2.2:Pornography`;
        description = $localize`:@@REPORT_DESCRIPTION__2.2:Printed or visual material of explicit sexual activity`;
        break;
      case '2.3':
        label = $localize`:@@REPORT__2.3:Profanity`;
        description = $localize`:@@REPORT_DESCRIPTION__2.3:Obscene language or sensational content`;
        break;
      case '2.4':
        label = $localize`:@@REPORT__2.4:Violence and Gore`;
        description = $localize`:@@REPORT_DESCRIPTION__2.4:Vivid, brutal, and realistic acts of violence`;
        break;
      case '2.5':
        label = $localize`:@@REPORT__2.5:Race, Religion, Gender`;
        description = $localize`:@@REPORT_DESCRIPTION__2.5:Extreme content relating to race, religion, or gender`;
        break;
      case '3':
        label = $localize`:@@REPORT__3:Incitement to violence`;
        description = $localize`:@@REPORT_DESCRIPTION__3:Calls to violence that are imminent`;
        break;
      case '4':
        label = $localize`:@@REPORT__4:Harassment`;
        description = $localize`:@@REPORT_DESCRIPTION__4:Intentionally targeting someone with the intent to torment or terrorize them`;
        break;
      case '5':
        label = $localize`:@@REPORT__5:Personal and confidential information`;
        description = $localize`:@@REPORT_DESCRIPTION__5:Sharing or threatening to share private, personal, or confidential information about someone`;
        break;
      case '7':
        label = $localize`:@@REPORT__7:Impersonation`;
        description = $localize`:@@REPORT_DESCRIPTION__7:Assuming a false or fictitious identity, except for parody`;
        break;
      case '8':
        label = $localize`:@@REPORT__8:Spam`;
        description = $localize`:@@REPORT_DESCRIPTION__8:Repeated, unwanted, or unsolicited manual or automated actions that negatively affect the Minds community`;
        break;
      case '10':
        label = $localize`:@@REPORT__10:Intellectual Property violation`;
        description = $localize`:@@REPORT_DESCRIPTION__10:Content posted to Minds that infringes a copyright you own or control`;
        break;
      case '13':
        label = $localize`:@@REPORT__13:Malware`;
        description = $localize`:@@REPORT_DESCRIPTION__13:Code delivered over the network for the purpose of an attack`;
        break;
      case '16':
        label = $localize`:@@REPORT__16:Inauthentic engagement`;
        description = $localize`:@@REPORT_DESCRIPTION__16:Activity that seeks to artificially inflate activity on the site to increase interaction metrics`;
        break;
      case '17':
        label = $localize`:@@REPORT__17:Security`;
        break;
      case '17.1':
        label = $localize`:@@REPORT__17.1:Hacked account`;
        description = $localize`:@@REPORT_DESCRIPTION__17.1:If an account has been compromised by an unauthorized person or entity`;
        break;
      case '11':
        label = $localize`:@@REPORT__11:Another reason`;
        description = $localize`:@@REPORT_DESCRIPTION__11:A reason other than one listed`;
        break;
    }

    if (reason.hasMore && reason.reasons?.length) {
      reasons = reason.reasons.map(r => this.localizeReason(r, id));
    }

    return {
      ...reason,
      reasons,
      label,
      description,
    };
  };
}
