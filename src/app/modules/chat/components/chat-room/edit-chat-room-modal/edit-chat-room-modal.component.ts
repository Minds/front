import { CommonModule as NgCommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '../../../../../common/common.module';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { ChatRoomEdge } from '../../../../../../graphql/generated.engine';
import { BehaviorSubject } from 'rxjs';
import { UpdateChatRoomNameService } from '../../../services/update-chat-room-name.service';

/** Modal input data. */
export type EditChatRoomModalData = {
  onCompleted: () => void;
  chatRoomEdge: ChatRoomEdge;
};

/**
 * Edit chat room modal.
 */
@Component({
  selector: 'm-chatRoom__editModal',
  templateUrl: './edit-chat-room-modal.component.html',
  styleUrls: ['./edit-chat-room-modal.component.ng.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgCommonModule, CommonModule, ReactiveFormsModule],
  standalone: true,
})
export class EditChatRoomModalComponent implements OnInit {
  /** Form group. */
  protected formGroup: FormGroup;

  /** The edge of the chat room we are editing. */
  private chatRoomEdge: ChatRoomEdge;

  /** On completed callback. */
  private onCompleted: () => void;

  /** Whether saving is in progess. */
  protected saveInProgress$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private updateChatRoomNameService: UpdateChatRoomNameService,
    private formBuilder: FormBuilder,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      roomName: [
        this.chatRoomEdge?.node?.name ?? '',
        {
          validators: [
            Validators.required,
            Validators.maxLength(128),
            Validators.minLength(1),
          ],
        },
      ],
    });
  }

  /**
   * Set modal data.
   * @param { EditChatRoomModalData } modalData - Modal data.
   * @returns { void }
   */
  public setModalData({
    onCompleted,
    chatRoomEdge,
  }: EditChatRoomModalData): void {
    this.onCompleted = onCompleted;
    this.chatRoomEdge = chatRoomEdge;
  }

  /**
   * Handle update click.
   * @returns { Promise<void> }
   */
  protected async onUpdateClick(): Promise<void> {
    try {
      this.saveInProgress$.next(true);
      await this.updateChatRoomNameService.update(
        this.chatRoomEdge.node.guid,
        this.formGroup.value.roomName
      );
      this.onCompleted();
    } catch (e: unknown) {
      console.error(e);
      this.toaster.error(e);
    } finally {
      this.saveInProgress$.next(false);
    }
  }
}
