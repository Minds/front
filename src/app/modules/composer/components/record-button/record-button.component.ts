import {
  Component,
  EventEmitter,
  Inject,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { AudioRecordingService } from '../../../../common/services/audio-recording.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { PlusUpgradeModalService } from '../../../wire/v2/plus-upgrade-modal.service';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import {
  AUDIO_PERMISSIONS_ERROR_MESSAGE,
  PermissionsService,
} from '../../../../common/services/permissions.service';
import { Session } from '../../../../services/session';

/**
 * Composer record button component - alows the user to record audio
 * and emits the file as a blob when recording is stopped.
 */
@Component({
  selector: 'm-composer__recordButton',
  styleUrls: ['./record-button.component.ng.scss'],
  template: `
    <i
      class="material-icons m-composer__recordButton"
      (click)="toggleRecord()"
      [ngClass]="{ 'm-composer__recordButton--recording': recording() }"
    >
      {{ recording() ? 'stop' : 'mic' }}
    </i>
  `,
  providers: [AudioRecordingService],
})
export class ComposerRecordButtonComponent {
  /** Whether the user is recording audio. */
  protected readonly recording: WritableSignal<boolean> = signal(false);

  /** Emits the file as a blob when recording is stopped. */
  @Output('recordingEnded') private recordingEndedEmitter: EventEmitter<Blob> =
    new EventEmitter<Blob>();

  constructor(
    private audioRecordingService: AudioRecordingService,
    private toastService: ToasterService,
    private permissionService: PermissionsService,
    private plusUpgradeModalService: PlusUpgradeModalService,
    private session: Session,
    @Inject(IS_TENANT_NETWORK) private isTenantNetwork: boolean
  ) {}

  /**
   * Toggles recording of audio.
   * @returns { Promise<void> }
   */
  protected async toggleRecord(): Promise<void> {
    if (!this.handleAudioPermissionCheck()) {
      return;
    }

    const initialRecordingState: boolean = this.recording();

    try {
      if (!initialRecordingState) {
        await this.audioRecordingService.startRecording();
      } else {
        const blob: Blob = await this.audioRecordingService.stopRecording();

        if (!blob) {
          throw new Error('Did not recieve any recorded audio');
        }

        this.recordingEndedEmitter.emit(blob);
      }
      this.recording.set(!initialRecordingState);
    } catch (e: any) {
      this.recording.set(false);
      this.toastService.error(e?.message ?? 'Error recording audio');
      console.error(e);
    }
  }

  /**
   * Handles audio permissions check.
   * @returns { boolean } whether the user has audio permissions.
   */
  private handleAudioPermissionCheck(): boolean {
    if (this.permissionService.canUploadAudio()) {
      return true;
    }

    if (!this.isTenantNetwork && !this.session.getLoggedInUser()?.plus) {
      this.toastService.warn('Only Plus members can upload audio.');
      this.plusUpgradeModalService.open();
    } else {
      this.toastService.warn(AUDIO_PERMISSIONS_ERROR_MESSAGE);
    }

    return false;
  }
}
