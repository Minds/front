import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TwitterConnectionService } from '../../twitter/services/twitter-connection.service';

const noOp = () => {};
const DEFAULT_TITLE = 'Confirm';
const DEFAULT_BODY = 'Are you sure?';

type SupermindReplyConfirmModalConfig = {
  isTwitterReplyRequired: boolean | undefined;
  onConfirm: () => any;
  onClose: () => any;
};

/**
 * Generic confirmation modal with changeable title and body
 */
@Component({
  selector: 'm-supermindReplyConfirmationModal',
  templateUrl: 'supermind-reply-confirm-modal.component.html',
  styleUrls: ['./supermind-reply-confirm-modal.component.ng.scss'],
})
export class SupermindReplyConfirmModalComponent implements OnInit {
  public isTwitterReplyEnabled: boolean = false;

  public isTwitterReplyRequired: boolean = false;

  // whether request for config is in progress.
  public configRequestInProgress$: BehaviorSubject<boolean> = this
    .twitterConnection.configRequestInProgress$;

  constructor(private twitterConnection: TwitterConnectionService) {}

  /**
   * Triggered on confirm click
   */
  public onConfirm: () => any = noOp;

  public twitterReplyCheckbox: UntypedFormControl = new UntypedFormControl();

  /**
   * Triggered on cancel click
   */
  public onDismiss: () => any = noOp;

  public setModalData(config: SupermindReplyConfirmModalConfig): void {
    this.isTwitterReplyRequired = config.isTwitterReplyRequired || false;
    this.onConfirm = config.onConfirm || noOp;
    this.onDismiss = config.onClose || noOp;
    // windowClass: 'm-modalV2__mobileFullCover',
  }

  public async ngOnInit(): Promise<void> {
    // check if config for twitter is connected to determine whether to show option to post to twitter.
    const isConnected: boolean = await this.twitterConnection.isConnected(
      this.isTwitterReplyRequired
    );
    if (isConnected) {
      this.isTwitterReplyEnabled = true;
      this.twitterReplyCheckbox.setValue(this.isTwitterReplyRequired); // if required, default to checked.
    }
  }
}
