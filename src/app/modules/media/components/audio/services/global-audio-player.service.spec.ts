import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { GlobalAudioPlayerService } from './global-audio-player.service';
import { AudioPlayerService } from './audio-player.service';
import { AudioTrack } from '../types/audio-player.types';
import { BehaviorSubject } from 'rxjs';

describe('GlobalAudioPlayerService', () => {
  let service: GlobalAudioPlayerService;
  let mockAudioElement: ElementRef<HTMLAudioElement>;
  let mockAudioPlayerService: AudioPlayerService;

  const mockAudioTrack: AudioTrack = {
    src: 'test.mp3',
    duration: 100,
  };

  beforeEach(() => {
    mockAudioElement = {
      nativeElement: {
        play: jasmine.createSpy('play'),
        pause: jasmine.createSpy('pause'),
        currentTime: 0,
        volume: 1,
        muted: false,
        ended: false,
        addEventListener: jasmine.createSpy('addEventListener'),
      },
    } as any;

    mockAudioPlayerService = {
      playing$: new BehaviorSubject<boolean>(false),
      loading$: new BehaviorSubject<boolean>(false),
      volume$: new BehaviorSubject<number>(100),
      muted$: new BehaviorSubject<boolean>(false),
      currentAudioTime$: new BehaviorSubject<number>(0),
      onUnregisterActivePlayer: jasmine.createSpy('onUnregisterActivePlayer'),
    } as any;

    TestBed.configureTestingModule({
      providers: [GlobalAudioPlayerService],
    });

    service = TestBed.inject(GlobalAudioPlayerService);
    service.setAudioElement(mockAudioElement);
    service.registerActiveAudioPlayerService(mockAudioPlayerService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('setAudioElement', () => {
    it('should set audio element', () => {
      expect((service as any).audioElement).toBe(mockAudioElement);
    });
  });

  describe('registerActiveAudioPlayerService', () => {
    it('should register active audio player service', () => {
      service.registerActiveAudioPlayerService(mockAudioPlayerService);
      expect((service as any).audioPlayerService).toBe(mockAudioPlayerService);
    });
  });

  describe('unregisterActiveAudioPlayerService', () => {
    it('should unregister active audio player service', () => {
      service.registerActiveAudioPlayerService(mockAudioPlayerService);
      service.unregisterActiveAudioPlayerService();
      expect(
        mockAudioPlayerService.onUnregisterActivePlayer
      ).toHaveBeenCalled();
      expect((service as any).audioPlayerService).toBeNull();
    });
  });

  describe('loadTrack', () => {
    it('should load track', () => {
      service.loadTrack(mockAudioTrack);
      expect(service.currentAudioTrack$.getValue()).toBe(mockAudioTrack);
    });
  });

  describe('play', () => {
    it('should play audio', fakeAsync(() => {
      (service as any).audioPlayerService.playing$.next(false);
      (mockAudioElement.nativeElement.play as any).and.returnValue(
        Promise.resolve()
      );
      service.play();
      tick();

      expect(mockAudioElement.nativeElement.play).toHaveBeenCalled();
      expect(mockAudioPlayerService.playing$.getValue()).toBe(true);
      expect(mockAudioPlayerService.loading$.getValue()).toBe(false);
    }));

    it('should play audio from start if played when at the end', fakeAsync(() => {
      (service as any).audioPlayerService.playing$.next(false);
      (service as any).audioPlayerService.currentAudioTime$.next(100);
      Object.defineProperty(mockAudioElement.nativeElement, 'ended', {
        value: true,
        writable: true,
      });
      (mockAudioElement.nativeElement.play as any).and.returnValue(
        Promise.resolve()
      );
      service.play();
      tick();

      expect(mockAudioElement.nativeElement.currentTime).toBe(0);
      expect(mockAudioElement.nativeElement.play).toHaveBeenCalled();
      expect(mockAudioPlayerService.playing$.getValue()).toBe(true);
      expect(mockAudioPlayerService.loading$.getValue()).toBe(false);
    }));
  });

  describe('pause', () => {
    it('should pause audio', () => {
      mockAudioPlayerService.playing$.next(true);
      service.pause();

      expect(mockAudioElement.nativeElement.pause).toHaveBeenCalled();
      expect(mockAudioPlayerService.playing$.getValue()).toBe(false);
    });
  });

  describe('clearCurrentAudioTrack', () => {
    it('should clear current audio track', () => {
      service.currentAudioTrack$.next(mockAudioTrack);
      service.clearCurrentAudioTrack();
      expect(service.currentAudioTrack$.getValue()).toBeNull();
    });
  });

  describe('seek', () => {
    it('should seek to time', () => {
      mockAudioElement.nativeElement.currentTime = 0;
      service.seek(50);
      expect(mockAudioElement.nativeElement.currentTime).toBe(50);
    });
  });

  describe('skipBack', () => {
    it('should skip back by default duration', () => {
      mockAudioElement.nativeElement.currentTime = 50;
      service.skipBack();
      expect(mockAudioElement.nativeElement.currentTime).toBe(40);
    });

    it('should skip back by specified duration', () => {
      mockAudioElement.nativeElement.currentTime = 50;
      service.skipBack(20);
      expect(mockAudioElement.nativeElement.currentTime).toBe(30);
    });
  });

  describe('skipForward', () => {
    it('should skip forward by default duration', () => {
      mockAudioElement.nativeElement.currentTime = 50;
      service.skipForward();
      expect(mockAudioElement.nativeElement.currentTime).toBe(60);
    });

    it('should skip forward by specified duration', () => {
      mockAudioElement.nativeElement.currentTime = 50;
      service.skipForward(20);
      expect(mockAudioElement.nativeElement.currentTime).toBe(70);
    });
  });

  describe('setVolume', () => {
    it('should set volume', () => {
      service.setVolume(50);
      expect(mockAudioElement.nativeElement.volume).toBe(0.5);
      expect(mockAudioPlayerService.volume$.getValue()).toBe(50);
    });
  });

  describe('mute', () => {
    it('should mute audio', () => {
      service.mute();
      expect(mockAudioElement.nativeElement.muted).toBe(true);
      expect(mockAudioPlayerService.muted$.getValue()).toBe(true);
    });
  });

  describe('unmute', () => {
    it('should unmute audio', () => {
      service.unmute();
      expect(mockAudioElement.nativeElement.muted).toBe(false);
      expect(mockAudioPlayerService.muted$.getValue()).toBe(false);
    });
  });
});
