import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { QualityScoreService } from './quality-score.service';
import { MindsUser } from '../../../interfaces/entities';

@Component({
  selector: 'm-channel--quality-score',
  templateUrl: 'quality-score.component.html',
  styleUrls: ['./quality-score.component.scss'],
  providers: [QualityScoreService],
})
export class QualityScoreComponent implements OnInit {
  @Input() targetUser: MindsUser;

  @HostBinding('style.--score-color') color = 'hsl(0, 55%, 45%)';
  public qualityScore = 0;
  public inProgress = true;

  constructor(
    private session: Session,
    private qualityScoreService: QualityScoreService
  ) {}

  async ngOnInit() {
    await this.setQualityScoreSubscriptionAsync();
    this.setColor();
    this.inProgress = false;
  }

  public isAdmin(): boolean {
    return this.session.isAdmin();
  }

  private setColor(): void {
    const hue = (this.qualityScore * 130).toString(10);
    this.color = `hsl(${hue}, 55%, 45%)`;
  }

  private async setQualityScoreSubscriptionAsync(): Promise<any> {
    this.qualityScore = await this.qualityScoreService
      .getUserQualityScore(this.targetUser.guid)
      .toPromise();
  }
}
