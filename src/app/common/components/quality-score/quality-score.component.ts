import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { QualityScoreService } from './quality-score.service';
import { MindsUser } from '../../../interfaces/entities';

/**
 * The logic that handles the `m-accountQualityScore` component
 */
@Component({
  selector: 'm-accountQualityScore',
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
    await this.setQualityScoreAsync();
    this.setColor();
    this.formatQualityScore();
    this.inProgress = false;
  }

  public isAdmin(): boolean {
    return this.session.isAdmin();
  }

  private formatQualityScore(): void {
    this.qualityScore = Math.floor(this.qualityScore * 100);
  }

  private setColor(): void {
    const hue = (this.qualityScore * 130).toString(10);
    this.color = `hsl(${hue}, 55%, 45%)`;
  }

  private async setQualityScoreAsync(): Promise<void> {
    this.qualityScore = await this.qualityScoreService
      .getUserQualityScore(this.targetUser.guid)
      .toPromise();
  }
}
