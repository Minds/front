import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../injection-tokens/common-injection-tokens';

/** Minimum audio length in seconds. */
const MIN_AUDIO_LENGTH_SECONDS: number = 2;

/**
 * Service for recording audio.
 */
@Injectable()
export class AudioRecordingService {
  /** Array of audio chunks. */
  private chunks: Blob[] = [];

  /** Media recorder instance. */
  private mediaRecorder: MediaRecorder;

  constructor(@Inject(WINDOW) private window: Window) {}

  /**
   * Starts recording audio.
   * @returns { Promise<void> }
   */
  public async startRecording(): Promise<void> {
    this.reset();
    try {
      const stream: MediaStream = await this.getUserMediaStream();

      this.mediaRecorder = this.buildMediaRecorder(stream);
      this.mediaRecorder.start();
      this.mediaRecorder.ondataavailable = (event: any) =>
        this.chunks.push(event.data);
    } catch (e: any) {
      // Re-throw error with a more user-friendly message.
      if (e.name === 'NotAllowedError') {
        throw new Error(
          'Unable to record. Please check your browser permissions.'
        );
      }
      throw e;
    }
  }

  /**
   * Stops recording audio.
   * @returns { Promise<Blob> } - the recorded audio blob.
   */
  public async stopRecording(): Promise<Blob> {
    this.mediaRecorder.stop();

    // Wait for the media recorder to stop.
    await new Promise((resolve) => (this.mediaRecorder.onstop = resolve));

    const blob: Blob = new Blob(this.chunks, {
      type: 'audio/ogg; codecs=opus',
    });
    this.reset();

    await this.validateAudioLength(blob);

    return blob;
  }

  /**
   * Validates the audio length.
   * @param { Blob } blob - The audio blob.
   * @returns { Promise<boolean> } - true if the audio length is valid, false otherwise.
   */
  private validateAudioLength(blob: Blob): Promise<boolean> {
    const audioElement = new Audio();
    const objectUrl = URL.createObjectURL(blob);
    audioElement.src = objectUrl;

    return new Promise<boolean>((resolve, reject) => {
      audioElement.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        if (audioElement.duration < MIN_AUDIO_LENGTH_SECONDS) {
          reject(
            new Error(
              `Audio must be at least ${MIN_AUDIO_LENGTH_SECONDS} seconds long`
            )
          );
        }
        resolve(true);
      };

      audioElement.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load audio file'));
      };
    });
  }

  /**
   * Gets the user media stream.
   * @returns { Promise<MediaStream> } - the user media stream.
   */
  private async getUserMediaStream(): Promise<MediaStream> {
    try {
      if (
        !this.window?.navigator?.mediaDevices ||
        !this.window?.navigator?.mediaDevices?.getUserMedia
      ) {
        // Must be on a secure domain or localhost.
        throw new Error('Unable to access any devices');
      }

      const stream = await this.window.navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (!stream) {
        throw new Error('Could not find any devices');
      }

      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw error;
    }
  }

  /**
   * Builds a media recorder.
   * @param { MediaStream } stream - The media stream.
   * @returns { MediaRecorder } - the built media recorder.
   */
  private buildMediaRecorder(stream: MediaStream): MediaRecorder {
    return new MediaRecorder(stream);
  }

  /**
   * Resets the audio recording service.
   * @returns { void }
   */
  private reset(): void {
    this.mediaRecorder = null;
    this.chunks = [];
  }
}
