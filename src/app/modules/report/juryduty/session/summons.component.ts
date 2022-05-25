import {
  Component,
  Input,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { JurySessionService } from './session.service';
import { SocketsService } from '../../../../services/sockets';

@Component({
  selector: 'm-juryDutySession__summons',
  templateUrl: 'summons.component.html',
})
export class JuryDutySessionSummonsComponent {
  showModal: boolean = false;
  expires: number = 0;
  expiresCountdown$: Subscription;
  accepted: boolean = false;
  inProgress: boolean = false;
  summons;
  reportUrn: string = '';
  report;

  subscriptionReadSubscription: Subscription;

  constructor(
    private sessionService: JurySessionService,
    private client: Client,
    private socketsService: SocketsService,
    private cd: ChangeDetectorRef
  ) {
    this.expires = 60; // 60 seconds
  }

  ngOnInit() {
    this.subscriptionReadSubscription = this.socketsService.onReady$.subscribe(
      () => {
        this.socketsService.join(`moderation_summon`);
      }
    );
    this.socketsService.subscribe(`moderation_summon`, summons => {
      if (this.showModal) return; // Already open
      this.report = null;
      this.accepted = false;
      this.summons = JSON.parse(summons);
      this.startSummons();
    });
  }

  startSummons() {
    if (this.expiresCountdown$) this.expiresCountdown$.unsubscribe();
    this.expires = parseInt(this.summons.ttl) / 2;
    this.reportUrn = this.summons.report_urn;
    this.showModal = true;
    this.detectChanges();
    this.expiresCountdown$ = interval(1000)
      .pipe(
        take(this.expires),
        map(v => --this.expires)
      )
      .subscribe(expires => {
        this.expires = expires;
        if (this.expires <= 0 && !this.accepted) this.showModal = false;
        this.detectChanges();
      });
  }

  ngOnDestroy() {
    if (this.expiresCountdown$) this.expiresCountdown$.unsubscribe();

    this.subscriptionReadSubscription?.unsubscribe();
  }

  async accept() {
    if (
      !confirm(
        'I am at least 18 years of age and volunteer to participate in this jury. I acknowledge that I may be exposed to content that is Not Safe for Work (NSFW) and understand the purpose of this jury is to enforce the content policy on Minds.'
      )
    ) {
      return;
    }
    this.accepted = true;
    this.detectChanges();

    this.inProgress = true;
    this.report = (<any>await this.client.post(`api/v2/moderation/summons`, {
      report_urn: this.summons.report_urn,
      jury_type: this.summons.jury_type,
      status: 'accepted',
    })).report;
    this.inProgress = false;
  }

  async decline() {
    await this.client.post(`api/v2/moderation/summons`, {
      report_urn: this.summons.report_urn,
      jury_type: this.summons.jury_type,
      status: 'declined',
    });

    this.showModal = false;
    this.detectChanges();
  }

  onClose(e) {
    this.accepted = false;
    this.report = null;
    this.showModal = false;
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
