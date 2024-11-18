import { TestBed } from '@angular/core/testing';
import { AudioPlayerAnalyticsService } from './audio-player-analytics.service';
import {
  AnalyticsService,
  ContextualizableEntity,
  SnowplowContext,
} from '../../../../../services/analytics';
import { MockService } from '../../../../../utils/mock';
import {
  AudioPauseAnalyticsEvent,
  AudioPlayAnalyticsEvent,
  AudioSeekAnalyticsEvent,
} from '../types/audio-player.types';

describe('AudioPlayerAnalyticsService', () => {
  let service: AudioPlayerAnalyticsService;

  const mockContext: SnowplowContext = { data: { entityId: '123' } };
  const mockEntity: ContextualizableEntity = {
    guid: '123',
  } as ContextualizableEntity;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AudioPlayerAnalyticsService,
        { provide: AnalyticsService, useValue: MockService(AnalyticsService) },
      ],
    });

    service = TestBed.inject(AudioPlayerAnalyticsService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize context', () => {
    (service as any).analyticsService.buildEntityContext.and.returnValue(
      mockContext
    );

    service.init(mockEntity);

    expect((service as any).context).toEqual(mockContext);
  });

  it('should track play event', () => {
    (service as any).context = mockContext;
    const mockEvent: AudioPlayAnalyticsEvent = {
      audio_time: 10,
      audio_duration: 120,
      audio_volume: 1,
      audio_muted: false,
    };

    service.trackPlayEvent(mockEvent);

    expect((service as any).analyticsService.capture).toHaveBeenCalledWith(
      'audio_play',
      { ...mockContext.data, ...mockEvent }
    );
  });

  it('should track pause event', () => {
    (service as any).context = mockContext;
    const mockEvent: AudioPauseAnalyticsEvent = {
      audio_time: 60,
      audio_duration: 120,
      audio_volume: 1,
      audio_muted: false,
    };

    service.trackPauseEvent(mockEvent);

    expect((service as any).analyticsService.capture).toHaveBeenCalledWith(
      'audio_pause',
      { ...mockContext.data, ...mockEvent }
    );
  });

  it('should track seek events', () => {
    (service as any).context = mockContext;
    const mockEvent: AudioSeekAnalyticsEvent = {
      audio_time: 0,
      audio_duration: 120,
      audio_volume: 1,
      audio_muted: false,
      audio_playing: true,
    };
    (service as any).processTrackSeekEvent(mockEvent);

    expect((service as any).analyticsService.capture).toHaveBeenCalledWith(
      'audio_seek',
      { ...mockContext.data, ...mockEvent }
    );
  });
});
