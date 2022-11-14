import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

const noOp = () => {};
const DEFAULT_TITLE = 'Confirm';
const DEFAULT_BODY = 'Are you sure?';

type SupermindReplyConfirmModalConfig = {
  isTwitterReplyEnabled: boolean | undefined;
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

  /**
   * Triggered on confirm click
   */
  public onConfirm: () => any = noOp;

  public twitterReplyCheckbox: FormControl = new FormControl();

  /**
   * Triggered on cancel click
   */
  public onDismiss: () => any = noOp;

  public setModalData(config: SupermindReplyConfirmModalConfig): void {
    this.isTwitterReplyEnabled = config.isTwitterReplyEnabled || false;
    this.isTwitterReplyRequired = config.isTwitterReplyRequired || false;
    this.onConfirm = config.onConfirm || noOp;
    this.onDismiss = config.onClose || noOp;
  }

  public ngOnInit(): void {
    this.twitterReplyCheckbox.setValue(true);
  }
}
