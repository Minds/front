import { ConfigsService } from './configs.service';
import { Injectable } from '@angular/core';

export type Reason = {
  label: string;
  reasons?: Reason[];
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
    let reasons;
    const id = parentId ? `${parentId}.${reason.value}` : String(reason.value);

    switch (id) {
      case '1':
        label = $localize`:@@REPORT__1:Illegal`;
        break;
      case '1.1':
        label = $localize`:@@REPORT__1.1:Terrorism`;
        break;
      case '1.2':
        label = $localize`:@@REPORT__1.2:Sexualization of minors`;
        break;
      case '1.3':
        label = $localize`:@@REPORT__1.3:Extortion`;
        break;
      case '1.4':
        label = $localize`:@@REPORT__1.4:Fraud`;
        break;
      case '1.5':
        label = $localize`:@@REPORT__1.5:Revenge Porn`;
        break;
      case '1.6':
        label = $localize`:@@REPORT__1.6:Trafficking`;
        break;
      case '2':
        label = $localize`:@@REPORT__2:NSFW (not safe for work)`;
        break;
      case '2.1':
        label = $localize`:@@REPORT__2.1:Nudity`;
        break;
      case '2.2':
        label = $localize`:@@REPORT__2.2:Pornography`;
        break;
      case '2.3':
        label = $localize`:@@REPORT__2.3:Profanity`;
        break;
      case '2.4':
        label = $localize`:@@REPORT__2.4:Violance and Gore`;
        break;
      case '2.5':
        label = $localize`:@@REPORT__2.5:Race, Religion, Gender`;
        break;
      case '3':
        label = $localize`:@@REPORT__3:Incitement to violence`;
        break;
      case '4':
        label = $localize`:@@REPORT__4:Harassment`;
        break;
      case '5':
        label = $localize`:@@REPORT__5:Personal and confidential information`;
        break;
      case '7':
        label = $localize`:@@REPORT__7:Impersonation`;
        break;
      case '8':
        label = $localize`:@@REPORT__8:Spam`;
        break;
      case '10':
        label = $localize`:@@REPORT__10:Intellectual Property violation`;
        break;
      case '13':
        label = $localize`:@@REPORT__13:Malware`;
        break;
      case '16':
        label = $localize`:@@REPORT__16:Inauthentic engagement`;
        break;
      case '17':
        label = $localize`:@@REPORT__17:Security`;
        break;
      case '17.1':
        label = $localize`:@@REPORT__17.1:Hacked account`;
        break;
      case '11':
        label = $localize`:@@REPORT__11:Another reason`;
        break;
    }

    if (reason.hasMore && reason.reasons?.length) {
      reasons = reason.reasons.map(r => this.localizeReason(r, id));
    }

    return {
      ...reason,
      reasons,
      label,
    };
  };
}
