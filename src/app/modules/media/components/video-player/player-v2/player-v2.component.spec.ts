import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { MindsVideoPlayerV2Component } from './player-v2.component';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { ChangeDetectorRef, ElementRef, PLATFORM_ID } from '@angular/core';
import { VideoPlayerService, VideoSource } from '../player.service';
import { AutoProgressVideoService } from '../../video/auto-progress-overlay/auto-progress-video.service';
import { BehaviorSubject, of } from 'rxjs';

describe('MindsVideoPlayerV2Component', () => {
  let comp: MindsVideoPlayerV2Component;
  let fixture: ComponentFixture<MindsVideoPlayerV2Component>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MindsVideoPlayerV2Component,
          MockComponent({
            selector: 'm-videoJsPlayer',
            inputs: ['options'],
            outputs: [
              'onReady',
              'onPlay',
              'onEnded',
              'onMetadataLoaded',
              'onSeeking',
              'onVolumeChange',
              'onFullscreenChange',
            ],
          }),
        ],
        providers: [
          {
            provide: ElementRef,
            useValue: MockService(ElementRef),
          },
          {
            provide: VideoPlayerService,
            useValue: null,
          },
          {
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provide: AutoProgressVideoService,
            useValue: MockService(AutoProgressVideoService),
          },
          {
            provide: PLATFORM_ID,
            useValue: 'browser',
          },
        ],
      })
        .overrideProvider(VideoPlayerService, {
          useValue: MockService(VideoPlayerService, {
            has: ['isPlayable$', 'sources$', 'onReady$'],
            props: {
              isPlayable$: { get: () => new BehaviorSubject<boolean>(true) },
              sources$: { get: () => new BehaviorSubject<VideoSource[]>([]) },
              onReady$: { get: () => new BehaviorSubject<boolean>(true) },
            },
          }),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(MindsVideoPlayerV2Component);
    comp = fixture.componentInstance;

    (comp as any).service.sources$.next([{ src: 'minds.com/xyz' }]);
    (comp as any).service.status = 'transcoded';
    (comp as any).service.isModal = false;
    (comp as any).service.awaitingTranscode.and.returnValue(false);
    (comp as any).service.isPlayable$.next(true);

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should determine if player should show', () => {
    (comp as any).service.isPlayable$.next(true);
    (comp as any).service.sources$.next([{ src: '123' }]);

    expect(comp.showPlayer).toBeTrue();
  });

  it('should determine if player should NOT show because not playable', () => {
    (comp as any).service.isPlayable$.next(false);
    (comp as any).service.sources$.next([{ src: '123' }]);

    expect(comp.showPlayer).toBeFalse();
  });

  it('should determine if player should NOT show because no sources', () => {
    (comp as any).service.isPlayable$.next(true);
    (comp as any).service.sources$.next([]);

    expect(comp.showPlayer).toBeFalse();
  });

  it('should call to load on changes', () => {
    comp.ngOnChanges(null);
    expect((comp as any).service.load).toHaveBeenCalled();
  });

  it('should set guid in service on guid set', () => {
    const guid: string = '123';
    comp.guid = guid;
    expect((comp as any).service.setGuid).toHaveBeenCalledWith(guid);
  });

  it('should set isModal in service on isModal set', () => {
    const isModal: boolean = true;
    comp.isModal = isModal;
    expect((comp as any).service.setIsModal).toHaveBeenCalledWith(isModal);
  });

  it('should set shouldPlayInModal in service on shouldPlayInModal set', () => {
    const shouldPlayInModal: boolean = true;
    comp.shouldPlayInModal = shouldPlayInModal;
    expect((comp as any).service.setShouldPlayInModal).toHaveBeenCalledWith(
      shouldPlayInModal
    );
  });

  it('should get sources from service', () => {
    const sources: VideoSource[] = [
      {
        src: 'minds.com/xyz',
        id: '123',
        type: 'type',
        size: 1,
      },
    ];
    (comp as any).service.sources$.next(sources);
    expect(comp.sources$.getValue()).toBe(sources);
  });

  it('should get awaiting transcode from service', () => {
    const awaitingTranscode = of(true);
    (comp as any).service.awaitingTranscode.and.returnValue(awaitingTranscode);
    expect(comp.awaitingTranscode).toEqual(awaitingTranscode);
  });

  it('should play appropriately on placeholder click', fakeAsync(() => {
    (comp as any).player = {
      play: jasmine.createSpy('play'),
      setMuted: jasmine.createSpy('setMuted'),
    };
    (comp as any).service.isPlayable$.next(true);
    comp.onPlaceholderClick(null);
    tick();

    expect((comp as any).player.setMuted).toHaveBeenCalledWith(false);
    expect((comp as any).player.play).toHaveBeenCalled();
  }));

  it('should not change isPlayable on placeholder click when appropriate', fakeAsync(() => {
    (comp as any).player = {
      play: jasmine.createSpy('play'),
      setMuted: jasmine.createSpy('setMuted'),
    };
    (comp as any).service.isPlayable$.next(false);
    (comp as any).service.shouldPlayInModal = true;
    comp.onPlaceholderClick(null);
    tick();

    expect((comp as any).service.isPlayable$.getValue()).toBe(false);
  }));

  it('should get option to unmute', () => {
    comp.options.muted = true;
    comp.unmute();
    expect(comp.options.muted).toBeFalse();
  });

  it('should get option to mute', () => {
    comp.options.muted = false;
    comp.mute();
    expect(comp.options.muted).toBeTrue();
  });

  it('should pause', () => {
    (comp as any).player = {
      pause: jasmine.createSpy('pause'),
    };
    comp.pause();
    expect(comp.player.pause).toHaveBeenCalled();
  });

  it('should check if is playing', () => {
    (comp as any).player = {
      isPlaying: jasmine.createSpy('isPlaying').and.returnValue(true),
    };
    expect(comp.isPlaying()).toBe(true);
  });

  it('should check if is NOT playing', () => {
    (comp as any).player = {
      isPlaying: jasmine.createSpy('isPlaying').and.returnValue(false),
    };
    expect(comp.isPlaying()).toBe(false);
  });

  it('should check if is NOT playing because player is not initialized', () => {
    (comp as any).player = null;
    expect(comp.isPlaying()).toBe(false);
  });

  it('should call to pause on stop', () => {
    (comp as any).player = {
      pause: jasmine.createSpy('pause'),
    };
    comp.stop();
    expect(comp.player.pause).toHaveBeenCalled();
  });

  it('should emit dimensions', () => {
    spyOn(comp.dimensions, 'emit');

    comp.emitDimensions({
      videoHeight: 10,
      videoWidth: 20,
    });

    expect(comp.dimensions.emit).toHaveBeenCalledWith({
      height: 10,
      width: 20,
    });
  });

  it('should check whether mute event should be tracked on ready', () => {
    (comp as any).player = {
      isMuted: jasmine.createSpy('isMuted').and.returnValue(true),
    };
    comp.shouldTrackUnmuteEvent = false;
    comp.onReady();

    expect(comp.shouldTrackUnmuteEvent).toBe(true);
  });

  it('should check whether mute event should NOT be tracked on ready', () => {
    (comp as any).player = {
      isMuted: jasmine.createSpy('isMuted').and.returnValue(false),
      getVolume: jasmine.createSpy('getVolume').and.returnValue(1),
    };
    comp.shouldTrackUnmuteEvent = false;
    comp.onReady();

    expect(comp.shouldTrackUnmuteEvent).toBe(false);
  });

  it('should track unmuted click on volume change once only when metric should be tracked', () => {
    comp.shouldTrackUnmuteEvent = true;
    comp.onVolumeChange();
    comp.onVolumeChange();

    expect((comp as any).service.trackClick).toHaveBeenCalledOnceWith(
      'video-player-unmuted'
    );
    expect(comp.shouldTrackUnmuteEvent).toBeFalse();
  });

  it('should NOT track unmuted click on volume change when metric should NOT be tracked', () => {
    comp.shouldTrackUnmuteEvent = false;
    comp.onVolumeChange();

    expect((comp as any).service.trackClick).not.toHaveBeenCalled();
    expect(comp.shouldTrackUnmuteEvent).toBeFalse();
  });
});
