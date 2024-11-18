import { TestBed } from '@angular/core/testing';
import { AudioPlayerService } from './audio-player.service';
import { GlobalAudioPlayerService } from './global-audio-player.service';
import { AudioPlayerAnalyticsService } from './audio-player-analytics.service';
import { MockService } from '../../../../../utils/mock';
import { AudioPlaybackState, AudioTrack } from '../types/audio-player.types';
import { ContextualizableEntity } from '../../../../../services/analytics';

describe('AudioPlayerService', () => {
  let service: AudioPlayerService;

  const mockData = {
    src: 'test.mp3',
    thumbnailSrc: 'test.jpg',
    author: 'Test Author',
    title: 'Test Title',
    duration: 100,
  };

  const mockAudioTrack: AudioTrack = {
    src: mockData.src,
    duration: mockData.duration,
  };

  const mockEntity: ContextualizableEntity = {
    guid: '123',
  } as ContextualizableEntity;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AudioPlayerService,
        {
          provide: GlobalAudioPlayerService,
          useValue: MockService(GlobalAudioPlayerService),
        },
        {
          provide: AudioPlayerAnalyticsService,
          useValue: MockService(AudioPlayerAnalyticsService),
        },
      ],
    });

    service = TestBed.inject(AudioPlayerService);
    (service as any).audioTrack$.next(mockAudioTrack);
    (service as any).currentAudioTime$.next(0);
    (service as any).loading$.next(false);
    (service as any).playing$.next(false);
    (service as any).volume$.next(100);
    (service as any).muted$.next(false);
    (service as any).isActivePlayer = true;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('audioPlaybackState$', () => {
    it('should emit the correct state for paused', (done: DoneFn) => {
      (service as any).loading$.next(false);
      (service as any).playing$.next(false);

      service.audioPlaybackState$.subscribe((state) => {
        expect(state).toBe(AudioPlaybackState.PAUSED);
        done();
      });
    });

    it('should emit the correct state for loading', (done: DoneFn) => {
      (service as any).loading$.next(true);
      (service as any).playing$.next(false);

      service.audioPlaybackState$.subscribe((state) => {
        expect(state).toBe(AudioPlaybackState.LOADING);
        done();
      });
    });

    it('should emit the correct state for playing', (done: DoneFn) => {
      (service as any).loading$.next(false);
      (service as any).playing$.next(true);

      service.audioPlaybackState$.subscribe((state) => {
        expect(state).toBe(AudioPlaybackState.PLAYING);
        done();
      });
    });
  });

  describe('registerActivePlayer', () => {
    it('should register as active player', () => {
      service.isActivePlayer = false;
      service.registerActivePlayer();
      expect(
        (service as any).globalAudioPlayerService
          .registerActiveAudioPlayerService
      ).toHaveBeenCalledWith(service);
      expect(service.isActivePlayer).toBe(true);
    });
  });

  describe('onUnregisterActivePlayer', () => {
    it('should unregister as active player', () => {
      service.onUnregisterActivePlayer();

      expect(
        (service as any).globalAudioPlayerService.pause
      ).toHaveBeenCalled();
      expect(
        (service as any).audioPlayerAnalyticsService.trackPauseEvent
      ).toHaveBeenCalledWith({
        audio_time: 0,
        audio_duration: mockData.duration,
        audio_volume: 100,
        audio_muted: false,
      });
      expect(service.isActivePlayer).toBe(false);
    });

    it('should unregister as active player and set loading to false, when true', () => {
      (service as any).loading$.next(true);

      service.onUnregisterActivePlayer();

      expect((service as any).loading$.getValue()).toBe(false);
      expect(
        (service as any).globalAudioPlayerService.pause
      ).toHaveBeenCalled();
      expect(
        (service as any).audioPlayerAnalyticsService.trackPauseEvent
      ).toHaveBeenCalledWith({
        audio_time: 0,
        audio_duration: mockData.duration,
        audio_volume: 100,
        audio_muted: false,
      });
      expect(service.isActivePlayer).toBe(false);
    });
  });

  describe('setAudioTrack', () => {
    it('should set audio track', () => {
      service.audioTrack$.next(null);
      service.setAudioTrack(mockAudioTrack);
      expect(service.audioTrack$.getValue()).toBe(mockAudioTrack);
    });
  });

  describe('reset', () => {
    it('should reset all values', () => {
      service.reset();
      expect(
        (service as any).globalAudioPlayerService.clearCurrentAudioTrack
      ).toHaveBeenCalled();
      expect(service.currentAudioTime$.getValue()).toBe(0);
      expect(service.volume$.getValue()).toBe(100);
      expect(service.loading$.getValue()).toBe(false);
      expect(service.muted$.getValue()).toBe(false);
      expect(service.isActivePlayer).toBe(false);
    });
  });

  describe('play', () => {
    it('should sync and play if not active player', () => {
      service.isActivePlayer = false;
      (service as any).audioTrack$.next(mockAudioTrack);
      (service as any).currentAudioTime$.next(5);
      (service as any).loading$.next(false);
      (service as any).playing$.next(false);
      (service as any).volume$.next(50);
      (service as any).muted$.next(true);

      service.play();

      expect(
        (service as any).globalAudioPlayerService
          .registerActiveAudioPlayerService
      ).toHaveBeenCalledWith(service);
      expect(service.isActivePlayer).toBe(true);
      expect(
        (service as any).globalAudioPlayerService.loadTrack
      ).toHaveBeenCalledWith(mockAudioTrack);
      expect(
        (service as any).globalAudioPlayerService.seek
      ).toHaveBeenCalledWith(5);
      expect((service as any).globalAudioPlayerService.mute).toHaveBeenCalled();
      expect(
        (service as any).globalAudioPlayerService.setVolume
      ).toHaveBeenCalledWith(50);
      expect((service as any).globalAudioPlayerService.play).toHaveBeenCalled();
      expect(
        (service as any).audioPlayerAnalyticsService.trackPlayEvent
      ).toHaveBeenCalledWith({
        audio_time: 5,
        audio_duration: mockData.duration,
        audio_volume: 50,
        audio_muted: true,
      });
    });

    it('should just play if active player', () => {
      service.isActivePlayer = true;

      service.play();

      expect(
        (service as any).globalAudioPlayerService
          .registerActiveAudioPlayerService
      ).not.toHaveBeenCalled();
      expect((service as any).globalAudioPlayerService.play).toHaveBeenCalled();
      expect(
        (service as any).audioPlayerAnalyticsService.trackPlayEvent
      ).toHaveBeenCalledWith({
        audio_time: 0,
        audio_duration: mockData.duration,
        audio_volume: 100,
        audio_muted: false,
      });
    });
  });

  describe('pause', () => {
    it('should pause', () => {
      service.pause();

      expect(
        (service as any).globalAudioPlayerService.pause
      ).toHaveBeenCalled();
      expect(
        (service as any).audioPlayerAnalyticsService.trackPauseEvent
      ).toHaveBeenCalledWith({
        audio_time: 0,
        audio_duration: mockData.duration,
        audio_volume: 100,
        audio_muted: false,
      });
    });
  });

  describe('seek', () => {
    it('should seek if active player', () => {
      (service as any).playing$.next(true);
      service.isActivePlayer = true;

      service.seek(50);

      expect(
        (service as any).globalAudioPlayerService.seek
      ).toHaveBeenCalledWith(50);
      expect(
        (service as any).audioPlayerAnalyticsService.trackSeekEvent
      ).toHaveBeenCalledWith({
        audio_time: 50,
        audio_duration: mockData.duration,
        audio_volume: 100,
        audio_muted: false,
        audio_playing: true,
      });
    });

    it('should only update time if not active player', () => {
      (service as any).playing$.next(false);
      service.isActivePlayer = false;

      service.seek(50);

      expect(
        (service as any).globalAudioPlayerService.seek
      ).not.toHaveBeenCalled();
      expect(service.currentAudioTime$.getValue()).toBe(50);
      expect(
        (service as any).audioPlayerAnalyticsService.trackSeekEvent
      ).toHaveBeenCalledWith({
        audio_time: 50,
        audio_duration: mockData.duration,
        audio_volume: 100,
        audio_muted: false,
        audio_playing: false,
      });
    });
  });

  describe('skipBack', () => {
    it('should skip back if active player', () => {
      (service as any).playing$.next(true);
      (service as any).currentAudioTime$.next(100);
      service.isActivePlayer = true;

      service.skipBack();

      expect(
        (service as any).globalAudioPlayerService.skipBack
      ).toHaveBeenCalledWith(10);
      expect(
        (service as any).audioPlayerAnalyticsService.trackSeekEvent
      ).toHaveBeenCalledWith({
        audio_time: 90,
        audio_duration: mockData.duration,
        audio_volume: 100,
        audio_muted: false,
        audio_playing: true,
      });
    });

    it('should skip back if not active player', () => {
      (service as any).playing$.next(false);
      (service as any).currentAudioTime$.next(100);
      service.isActivePlayer = false;

      service.skipBack();

      expect(
        (service as any).globalAudioPlayerService.skipBack
      ).not.toHaveBeenCalled();
      expect(service.currentAudioTime$.getValue()).toBe(90);
      expect(
        (service as any).audioPlayerAnalyticsService.trackSeekEvent
      ).toHaveBeenCalledWith({
        audio_time: 90,
        audio_duration: mockData.duration,
        audio_volume: 100,
        audio_muted: false,
        audio_playing: false,
      });
    });
  });

  describe('skipForward', () => {
    it('should skip forward if active player', () => {
      (service as any).playing$.next(true);
      (service as any).currentAudioTime$.next(100);
      service.isActivePlayer = true;

      service.skipForward();

      expect(
        (service as any).globalAudioPlayerService.skipForward
      ).toHaveBeenCalledWith(10);
      expect(
        (service as any).audioPlayerAnalyticsService.trackSeekEvent
      ).toHaveBeenCalledWith({
        audio_time: 110,
        audio_duration: mockData.duration,
        audio_volume: 100,
        audio_muted: false,
        audio_playing: true,
      });
    });

    it('should skip forward if not active player', () => {
      (service as any).playing$.next(false);
      (service as any).currentAudioTime$.next(100);
      service.isActivePlayer = false;

      service.skipForward();

      expect(
        (service as any).globalAudioPlayerService.skipForward
      ).not.toHaveBeenCalled();
      expect(service.currentAudioTime$.getValue()).toBe(110);
      expect(
        (service as any).audioPlayerAnalyticsService.trackSeekEvent
      ).toHaveBeenCalledWith({
        audio_time: 110,
        audio_duration: mockData.duration,
        audio_volume: 100,
        audio_muted: false,
        audio_playing: false,
      });
    });
  });

  describe('setVolume', () => {
    it('should set volume if active player', () => {
      service.isActivePlayer = true;
      service.setVolume(50);
      expect(
        (service as any).globalAudioPlayerService.setVolume
      ).toHaveBeenCalledWith(50);
    });

    it('should only update volume if not active player', () => {
      service.isActivePlayer = false;
      service.setVolume(50);

      expect(
        (service as any).globalAudioPlayerService.setVolume
      ).not.toHaveBeenCalled();
      expect(service.volume$.getValue()).toBe(50);
    });
  });

  describe('mute', () => {
    it('should mute if active player', () => {
      service.isActivePlayer = true;
      service.muted$.next(false);

      service.mute();

      expect((service as any).globalAudioPlayerService.mute).toHaveBeenCalled();
    });

    it('should only update mute state if not active player', () => {
      service.isActivePlayer = false;
      service.muted$.next(false);

      service.mute();

      expect(
        (service as any).globalAudioPlayerService.mute
      ).not.toHaveBeenCalled();
      expect(service.muted$.getValue()).toBe(true);
    });
  });

  describe('unmute', () => {
    it('should unmute if active player', () => {
      service.isActivePlayer = true;
      service.muted$.next(true);

      service.unmute();

      expect(
        (service as any).globalAudioPlayerService.unmute
      ).toHaveBeenCalled();
    });

    it('should only update mute state if not active player', () => {
      service.isActivePlayer = false;
      service.muted$.next(true);

      service.unmute();

      expect(
        (service as any).globalAudioPlayerService.unmute
      ).not.toHaveBeenCalled();
      expect(service.muted$.getValue()).toBe(false);
    });
  });

  describe('analytics', () => {
    it('should initialize analytics with entity', () => {
      service.setAnalyticsEntity(mockEntity);
      expect(
        (service as any).audioPlayerAnalyticsService.init
      ).toHaveBeenCalledWith(mockEntity);
    });
  });
});
