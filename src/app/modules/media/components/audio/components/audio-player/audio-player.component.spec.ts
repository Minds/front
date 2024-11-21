import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioPlayerComponent } from './audio-player.component';
import { AudioPlayerService } from '../../services/audio-player.service';
import { AudioPlayerAnalyticsService } from '../../services/audio-player-analytics.service';
import { BehaviorSubject } from 'rxjs';
import { AudioTimePipe } from '../../pipes/audio-time.pipe';
import { MatSliderModule } from '@angular/material/slider';
import { MockService } from '../../../../../../utils/mock';
import { AudioPlaybackState } from '../../types/audio-player.types';

describe('AudioPlayerComponent', () => {
  let comp: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;

  const mockData = {
    src: 'test.mp3',
    thumbnailSrc: 'test.jpg',
    author: 'Test Author',
    title: 'Test Title',
    duration: 100,
    entity: { guid: '123' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AudioPlayerComponent, MatSliderModule, AudioTimePipe],
    })
      .overrideProvider(AudioPlayerService, {
        useValue: MockService(AudioPlayerService, {
          has: [
            'currentAudioTime$',
            'playing$',
            'volume$',
            'muted$',
            'audioPlaybackState$',
            'isActivePlayer',
          ],
          props: {
            currentAudioTime$: { get: () => new BehaviorSubject(0) },
            playing$: { get: () => new BehaviorSubject(false) },
            volume$: { get: () => new BehaviorSubject(100) },
            muted$: { get: () => new BehaviorSubject(false) },
            audioPlaybackState$: {
              get: () => new BehaviorSubject(AudioPlaybackState.PAUSED),
            },
            isActivePlayer: false,
          },
        }),
      })
      .overrideProvider(AudioPlayerAnalyticsService, {
        useValue: MockService(AudioPlayerAnalyticsService),
      })
      .compileComponents();

    fixture = TestBed.createComponent(AudioPlayerComponent);
    comp = fixture.componentInstance;

    (comp as any).src = mockData.src;
    (comp as any).thumbnailSrc = mockData.thumbnailSrc;
    (comp as any).author = mockData.author;
    (comp as any).title = mockData.title;
    (comp as any).duration = mockData.duration;
    (comp as any).entity = mockData.entity;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
    expect((comp as any).audioPlayerService.setAudioTrack).toHaveBeenCalledWith(
      {
        src: mockData.src,
        duration: mockData.duration,
      }
    );
    expect(
      (comp as any).audioPlayerService.setAnalyticsEntity
    ).toHaveBeenCalledWith(mockData.entity);
  });

  describe('onMouseEnter / onMouseLeave', () => {
    it('should set isMouseOver to true', () => {
      (comp as any).onMouseEnter();
      expect((comp as any).isMouseOver).toBe(true);
    });

    it('should set isMouseOver to false', () => {
      (comp as any).onMouseLeave();
      expect((comp as any).isMouseOver).toBe(false);
    });
  });

  describe('onLeftArrowKeyDown', () => {
    it('should call onSkipBackClick when left arrow key is pressed when mouse is over and the player is active', () => {
      (comp as any).isMouseOver = true;
      (comp as any).audioPlayerService.isActivePlayer = true;

      (comp as any).onLeftArrowKeyDown({
        preventDefault: () => {},
      } as KeyboardEvent);
      expect((comp as any).audioPlayerService.skipBack).toHaveBeenCalled();
    });

    it('should not call onSkipBackClick when left arrow key is pressed when mouse is not over and the player is not active', () => {
      (comp as any).isMouseOver = false;
      (comp as any).audioPlayerService.isActivePlayer = false;

      (comp as any).onLeftArrowKeyDown({
        preventDefault: () => {},
      } as KeyboardEvent);
      expect((comp as any).audioPlayerService.skipBack).not.toHaveBeenCalled();
    });
  });

  describe('onRightArrowKeyDown', () => {
    it('should call onSkipForwardClick when right arrow key is pressed when mouse is over and the player is active', () => {
      (comp as any).isMouseOver = true;
      (comp as any).audioPlayerService.isActivePlayer = true;

      (comp as any).onRightArrowKeyDown({
        preventDefault: () => {},
      } as KeyboardEvent);
      expect((comp as any).audioPlayerService.skipForward).toHaveBeenCalled();
    });

    it('should not call onSkipForwardClick when right arrow key is pressed when mouse is not over and the player is not active', () => {
      (comp as any).isMouseOver = false;
      (comp as any).audioPlayerService.isActivePlayer = false;

      (comp as any).onRightArrowKeyDown({
        preventDefault: () => {},
      } as KeyboardEvent);
      expect(
        (comp as any).audioPlayerService.skipForward
      ).not.toHaveBeenCalled();
    });
  });

  describe('onSpaceKeyDown', () => {
    it('should toggle to play when space key is pressed when mouse is over', () => {
      (comp as any).isMouseOver = true;
      (comp as any).audioPlayerService.playing$.next(false);

      (comp as any).onSpaceKeyDown({
        preventDefault: () => {},
      } as KeyboardEvent);
      expect((comp as any).audioPlayerService.play).toHaveBeenCalled();
    });

    it('should toggle to pause when space key is pressed when mouse is over', () => {
      (comp as any).isMouseOver = true;
      (comp as any).audioPlayerService.playing$.next(true);

      (comp as any).onSpaceKeyDown({
        preventDefault: () => {},
      } as KeyboardEvent);
      expect((comp as any).audioPlayerService.pause).toHaveBeenCalled();
    });
  });

  describe('onPlayClick', () => {
    it('should call play on audio player service', () => {
      (comp as any).onPlayClick();
      expect((comp as any).audioPlayerService.play).toHaveBeenCalled();
    });
  });

  describe('onPauseClick', () => {
    it('should call pause on audio player service', () => {
      (comp as any).onPauseClick();
      expect((comp as any).audioPlayerService.pause).toHaveBeenCalled();
    });
  });

  describe('onSkipBackClick', () => {
    it('should call skipBack on audio player service', () => {
      (comp as any).onSkipBackClick();
      expect((comp as any).audioPlayerService.skipBack).toHaveBeenCalled();
    });
  });

  describe('onSkipForwardClick', () => {
    it('should call skipForward on audio player service', () => {
      (comp as any).onSkipForwardClick();
      expect((comp as any).audioPlayerService.skipForward).toHaveBeenCalled();
    });
  });

  describe('onSeek', () => {
    it('should call seek on audio player service', () => {
      (comp as any).onSeek({ target: { value: '10' } } as Event & {
        target: HTMLInputElement;
      });
      expect((comp as any).audioPlayerService.seek).toHaveBeenCalledWith(10);
    });
  });

  describe('onVolumeChange', () => {
    it('should call setVolume on audio player service', () => {
      (comp as any).onVolumeChange({ target: { value: '10' } } as Event & {
        target: HTMLInputElement;
      });
      expect((comp as any).audioPlayerService.setVolume).toHaveBeenCalledWith(
        10
      );
    });
  });

  describe('onVolumeIconClick', () => {
    it('should call toggleMute on audio player service', () => {
      (comp as any).onVolumeIconClick();
      expect((comp as any).audioPlayerService.toggleMute).toHaveBeenCalled();
    });
  });

  describe('onMouseOverThumbnailContainer', () => {
    it('should set thumbnailContainerHovered$ to true', () => {
      (comp as any).thumbnailContainerHovered$.next(false);
      (comp as any).onMouseOverThumbnailContainer();
      expect((comp as any).thumbnailContainerHovered$.getValue()).toBe(true);
    });
  });

  describe('onMouseLeaveThumbnailContainer', () => {
    it('should set thumbnailContainerHovered$ to false', () => {
      (comp as any).thumbnailContainerHovered$.next(true);
      (comp as any).onMouseLeaveThumbnailContainer();
      expect((comp as any).thumbnailContainerHovered$.getValue()).toBe(false);
    });
  });
});
