import { EventEmitter } from '@angular/core';

export interface MindsPlayerInterface {
  muted: boolean;
  poster: string;
  autoplay: boolean;
  src: string;

  onPlay: EventEmitter<HTMLVideoElement>;
  onPause: EventEmitter<HTMLVideoElement>;
  onEnd: EventEmitter<HTMLVideoElement>;
  onError: EventEmitter<{ player: HTMLVideoElement, e }>;

  getPlayer(): HTMLVideoElement;

  play(): void;
  pause(): void;
  toggle(): void;

  resumeFromTime(time: number);

  isLoading(): boolean;
  isPlaying(): boolean;

  requestFullScreen(): void;

  getInfo(): any;
}
