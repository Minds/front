import {
  Component,
  EventEmitter,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { AudioRecordingService } from '../../../../common/services/audio-recording.service';
import { ToasterService } from '../../../../common/services/toaster.service';

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
    private toastService: ToasterService
  ) {}

  /**
   * Toggles recording of audio.
   * @returns { Promise<void> }
   */
  protected async toggleRecord(): Promise<void> {
    const initialRecordingState: boolean = this.recording();

    try {
      if (!initialRecordingState) {
        await this.audioRecordingService.startRecording();
      } else {
        const blob: Blob = await this.audioRecordingService.stopRecording();
        this.recordingEndedEmitter.emit(blob);
      }
      this.recording.set(!initialRecordingState);
    } catch (e: any) {
      this.recording.set(false);
      this.toastService.error(e?.message ?? 'Error recording audio');
      console.error(e);
    }
  }
}
