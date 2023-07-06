import {
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnInit,
} from '@angular/core';
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
  /**
   * Represents the user to fetch the score for
   */
  @Input() targetUser: MindsUser;

  /**
   * Represents the color for the component's badge
   */
  @HostBinding('style.--score-color') color = 'hsl(0, 55%, 45%)';

  /**
   * Represents the account quality score fetched from the backend
   */
  public qualityScore = 0;

  /**
   * Represents if the data are still being fetched
   */
  public inProgress = true;

  constructor(
    private session: Session,
    private qualityScoreService: QualityScoreService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadQualityScoreAsync();
  }

  /**
   * Checks if the provided user is an Admin
   */
  public isAdmin(): boolean {
    return this.session.isAdmin();
  }

  /**
   * Prepare the quality score value to be a value between 0 and 100.
   * Note: the value is received as a float number with a value between 0 and 1.
   * @private
   */
  private formatQualityScore(): void {
    this.qualityScore = Math.floor(this.qualityScore * 100);
  }

  /**
   * Calculates the correct color to use for the badge based on the quality score value.
   * Updates the color property.
   * @private
   */
  private setColor(): void {
    const hue = (this.qualityScore * 130).toString(10);
    this.color = `hsl(${hue}, 55%, 45%)`;
  }

  /**
   * Updates the quality score property value
   * @private
   */
  private async loadQualityScoreAsync(): Promise<void> {
    if (!this.isAdmin()) {
      return;
    }

    this.inProgress = true;
    try {
      this.qualityScore = await this.qualityScoreService
        .getUserQualityScore(this.targetUser.guid)
        .toPromise();
      this.setColor();
      this.formatQualityScore();
    } catch (err) {
      // ?
    } finally {
      this.inProgress = false;
      // Ensure change detection has happened
      this.cd.markForCheck();
      this.cd.detectChanges();
    }
  }
}
