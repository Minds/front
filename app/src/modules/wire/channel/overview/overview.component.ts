import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { WireService } from '../../wire.service';


@Component({
  selector: 'm-wire-channel--overview',
  templateUrl: 'overview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class WireChannelOverviewComponent implements OnInit, OnDestroy {

  ready: boolean = true;
  stats: { count, money, points, sent? } = {
    count: 0,
    money: 0,
    points: 0,
    sent: 0
  };
  sentSubscription;

  @Input() channel: any;

  constructor(private wireService: WireService, private client: Client, public session: Session, private cd: ChangeDetectorRef) {
    this.sentSubscription = this.wireService.wireSent.subscribe((wire) => {
      this.getStats();
    });
  }

  ngOnInit() {
    this.getStats();
  }

  ngOnDestroy() {
    if (this.sentSubscription)
      this.sentSubscription.unsubscribe();
  }

  getStats() {
    this.client.get('api/v1/wire/sums/overview/' + this.channel.guid, {
      merchant: this.channel.merchant ? 1 : 0
    })
      .then(({ count, money, points }) => {
        this.stats = {
          count,
          money,
          points,
          sent: this.stats.sent
        };
        this.detectChanges();
      });

    if (!this.canWire())
      return;

    this.client.get('api/v1/wire/rewards/' + this.channel.guid)
      .then(({ sums }) => {
        if (this.channel.merchant) {
          this.stats.sent = sums.money;
        } else {
          this.stats.sent = sums.points;
        }

        this.detectChanges();
      });
  }

  canWire() {
    return this.session.getLoggedInUser().guid !== this.channel.guid && this.session.isLoggedIn();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
