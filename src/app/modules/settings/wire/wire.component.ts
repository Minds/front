import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Session } from '../../../services/session';
import { Client, Upload } from '../../../services/api';
import {
  WireRewardsStruc,
  WireRewardsTiers,
  WireRewardsType,
} from '../../wire/interfaces/wire.interfaces';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-settings--wire',
  templateUrl: 'wire.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SettingsWireComponent implements OnInit {
  inProgress: boolean = false;
  backgroundFile: HTMLInputElement;

  ts: number = Date.now();

  error: string = '';

  exclusive: any = {
    intro: '',
    background: 0,
    saved: false,
  };

  rewards: WireRewardsStruc;
  rewardsSaved: boolean = false;

  previewEntity: any = false;
  preview: any = {};

  constructor(
    public session: Session,
    public client: Client,
    public upload: Upload,
    private cd: ChangeDetectorRef,
    private configs: ConfigsService
  ) {
    this.rewards = session.getLoggedInUser().wire_rewards;
  }

  ngOnInit() {
    this.setUp();
  }

  setUp() {
    if (this.session.getLoggedInUser().merchant.exclusive) {
      this.exclusive = this.session.getLoggedInUser().merchant.exclusive;
    }

    this.updatePreviewEntity();
  }

  updatePreviewEntity() {
    this.previewEntity = {
      _preview: true,
      wire_threshold: {
        type: 'tokens',
        min: 1,
      },
      ownerObj: {
        ...this.session.getLoggedInUser(),
        merchant: {
          exclusive: {
            intro: this.exclusive.intro,
            _backgroundPreview:
              this.preview.src ||
              this.configs.get('cdn_url') +
                'fs/v1/paywall/preview/' +
                this.session.getLoggedInUser().guid +
                '/' +
                this.exclusive.background,
          },
        },
      },
    };

    this.exclusive.saved = false;

    this.detectChanges();
  }

  updatePreview(input: HTMLInputElement) {
    let file = input ? input.files[0] : null;

    var reader = new FileReader();
    reader.onloadend = () => {
      input.src =
        typeof reader.result === 'string'
          ? reader.result
          : reader.result.toString();
      this.backgroundFile = input;

      this.preview = { src: reader.result };
      this.updatePreviewEntity();
    };
    reader.readAsDataURL(file);

    this.detectChanges();
  }

  uploadPreview(input: HTMLInputElement): Promise<boolean> {
    let file = input ? input.files[0] : null;

    if (!file) {
      return Promise.resolve(true);
    }

    return this.upload
      .post('api/v1/merchant/exclusive-preview', [file], {}, progress => {
        console.log(progress);
      })
      .then((response: any) => {
        input.value = null;
        this.exclusive.background = Math.floor(Date.now() / 1000);
        this.detectChanges();

        return true;
      })
      .catch(e => {
        alert('Sorry, there was a problem. Try again.');
        input.value = null;
        this.detectChanges();

        return false;
      });
  }

  canSubmit(): boolean {
    return !this.exclusive.saved && !this.rewardsSaved;
  }

  async save() {
    this.inProgress = true;
    try {
      if (!this.exclusive.saved) {
        await this.savePreview();
      }

      /*if (!this.rewardsSaved) {
        await this.saveRewards();
      }*/
    } catch (e) {
      alert((e && e.message) || 'Server error');
    }
    this.inProgress = false;
  }

  savePreview(): Promise<any> {
    this.exclusive.saved = false;
    this.detectChanges();

    return this.uploadPreview(this.backgroundFile).then(() => {
      return this.client
        .post('api/v1/merchant/exclusive', this.exclusive)
        .then(() => {
          if (!this.session.getLoggedInUser().merchant) {
            this.session.getLoggedInUser().merchant = {};
          }
          this.session.getLoggedInUser().merchant.exclusive = this.exclusive;
          this.exclusive.saved = true;
          this.detectChanges();
        });
    });
  }

  onRewardsChange(rewards: WireRewardsTiers, type: WireRewardsType) {
    this.rewards.rewards[type] = rewards;
    this.rewardsSaved = false;
    this.detectChanges();
  }

  saveRewards(): Promise<any> {
    this.rewards.rewards.tokens = this._cleanAndSortRewards(
      this.rewards.rewards.tokens
    );

    return this.client
      .post('api/v1/wire/rewards', {
        rewards: this.rewards,
      })
      .then(() => {
        this.rewardsSaved = true;
      });
  }

  private _cleanAndSortRewards(rewards: any[]) {
    if (!rewards) {
      return [];
    }

    return rewards
      .filter(reward => reward.amount || `${reward.description}`.trim())
      .map(reward => ({
        ...reward,
        amount: Math.abs(Math.floor(reward.amount || 0)),
      }))
      .sort((a, b) => (a.amount > b.amount ? 1 : -1));
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
