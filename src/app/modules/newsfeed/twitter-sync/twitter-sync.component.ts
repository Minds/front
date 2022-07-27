import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { timer } from 'rxjs';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { Session } from '../../../services/session';
import { TwitterSyncService } from './twitter-sync.service';

@Component({
  selector: 'm-twitterSync',
  templateUrl: './twitter-sync.component.html',
  styleUrls: ['./twitter-sync.component.ng.scss'],
})
export class TwitterSyncComponent implements OnInit {
  // The setup form
  form: FormGroup;

  // The edit form (for once setup)
  updateForm: FormGroup;

  // If the twitter connect is setup
  isSetup = false;

  // If inprogress
  inProgress = true;

  // If saving
  isSaving = false;

  // The min number of followers we will try to sync for
  minFollowersForSync: number;

  constructor(
    private session: Session,
    protected twitterSyncService: TwitterSyncService,
    protected configs: ConfigsService,
    protected toasterService: ToasterService
  ) {
    this.form = new FormGroup({
      twitterHandle: new FormControl('', {
        validators: [Validators.required],
      }),
    });
    this.updateForm = new FormGroup({
      discoverable: new FormControl(true, {
        validators: [],
      }),
    });

    this.minFollowersForSync = configs.get('twitter').min_followers_for_sync;
  }

  ngOnInit() {
    this.twitterSyncService
      .getConnectedAccount()
      .then(account => {
        this.isSetup = true;
        this.updateForm.controls.discoverable.setValue(account.discoverable);
      })
      .finally(() => {
        this.inProgress = false;
      });
  }

  get username(): string {
    return this.session.getLoggedInUser().username;
  }

  get tweetMessage(): string {
    const siteUrl = this.configs.get('site_url');
    return 'Verifying my channel on @minds. ' + siteUrl + this.username;
  }

  postToTwitter(e: MouseEvent): void {
    window.open('https://twitter.com/intent/tweet?text=' + this.tweetMessage);
  }

  async onDisoverableCheckboxClick(e: MouseEvent): Promise<void> {
    this.isSaving = true;
    const newValue = !this.updateForm.controls.discoverable.value;
    try {
      await this.twitterSyncService.updateSettings({ discoverable: newValue });
      this.toasterService.success('Updated');
    } catch (err) {
      this.toasterService.error(err.message);
    } finally {
      this.isSaving = false;
    }
  }

  async verify(e: MouseEvent): Promise<void> {
    this.isSaving = true;

    this.toasterService.inform(
      'Please wait a moment, tweets can take a while to be visible.'
    );

    await timer(15000).toPromise(); // Delay by 15 seconds as twitter can take a while

    try {
      await this.twitterSyncService.createConnectAccount(
        this.form.controls.twitterHandle.value
      );
      this.isSetup = true;
    } catch (err) {
      this.toasterService.error(
        "Sorry, we couldn't find your verification post"
      );
    } finally {
      this.isSaving = false;
    }
  }

  async disconnect(e: MouseEvent): Promise<void> {
    this.isSaving = true;
    try {
      await this.twitterSyncService.disconnectAccount();
      this.isSetup = false;
    } catch (err) {
    } finally {
      this.isSaving = false;
    }
  }
}
