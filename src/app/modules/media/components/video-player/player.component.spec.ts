import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MindsVideoPlayerComponent } from './player.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ChangeDetectorRef, ElementRef, PLATFORM_ID } from '@angular/core';
import { VideoPlayerService, VideoSource } from './player.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { GlobalAudioPlayerService } from '../audio/services/global-audio-player.service';

describe('MindsVideoPlayerComponent', () => {
  let comp: MindsVideoPlayerComponent;
  let fixture: ComponentFixture<MindsVideoPlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MindsVideoPlayerComponent,
        MockComponent({
          selector: 'plyr',
          inputs: [
            'plyrDriver',
            'plyrPoster',
            'plyrPlaysInline',
            'plyrSources',
            'plyrOptions',
          ],
          outputs: [
            'plyrEnded',
            'plyrPlay',
            'plyrControlsShown',
            'plyrControlsHidden',
            'plyrEnterFullScreen',
            'plyrExitFullScreen',
            'plyrLoadedMetadata',
            'plyrPlaying',
            'plyrReady',
            'plyrVolumeChange',
            'plyrSeeking',
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
          provide: GlobalAudioPlayerService,
          useValue: MockService(GlobalAudioPlayerService, {
            has: ['played$'],
            props: {
              played$: { get: () => new Subject<boolean>() },
            },
          }),
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
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(MindsVideoPlayerComponent);
    comp = fixture.componentInstance;
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

  it('should set initially muted state onReady when muted', () => {
    (comp as any).shouldTrackUnmuteEvent = false;
    (comp as any).player = {
      player: {
        muted: true,
      },
    };
    comp.onReady();
    expect((comp as any).shouldTrackUnmuteEvent).toBeTrue();
  });

  it('should set initially muted state onReady when NOT muted', () => {
    (comp as any).shouldTrackUnmuteEvent = false;
    (comp as any).player = {
      player: {
        muted: false,
        volume: 100,
      },
    };
    comp.onReady();
    expect((comp as any).shouldTrackUnmuteEvent).toBeFalse();
  });

  it('should track action event when first unmuted, but not on second ended event', () => {
    (comp as any).shouldTrackUnmuteEvent = true;
    comp.onVolumeChange();
    comp.onVolumeChange();
    expect((comp as any).shouldTrackUnmuteEvent).toBeFalse();
    expect((comp as any).service.trackClick).toHaveBeenCalledOnceWith(
      'video-player-unmuted'
    );
  });
});
