import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollAwareVideoPlayerComponent } from './scrollaware-player.component';
import { ScrollService } from '../../../../services/ux/scroll';
import { Session } from '../../../../services/session';
import { VideoJsExperimentService } from '../../../experiments/sub-services/videojs-experiment.service';
import { Subject } from 'rxjs';
import { MockComponent, MockService } from '../../../../utils/mock';
import { PLATFORM_ID } from '@angular/core';

describe('ScrollAwareVideoPlayerComponent', () => {
  let comp: ScrollAwareVideoPlayerComponent;
  let fixture: ComponentFixture<ScrollAwareVideoPlayerComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        ScrollAwareVideoPlayerComponent,
        MockComponent({
          selector: 'm-videoPlayer',
          inputs: ['guid', 'shouldPlayInModal', 'isModal'],
          outputs: ['mediaModalRequested'],
          template: `<div></div>`,
        }),
      ],
      providers: [
        { provide: ScrollService, useValue: MockService(ScrollService) },
        { provide: Session, useValue: MockService(Session) },
        {
          provide: VideoJsExperimentService,
          useValue: MockService(VideoJsExperimentService),
        },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScrollAwareVideoPlayerComponent);
    comp = fixture.componentInstance;
    (comp as any).scrollService.listenForView.and.returnValue(
      new Subject<any>()
    );

    if (fixture.isStable()) {
      fixture.detectChanges();
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('onEnterViewport()', () => {
    beforeEach(() => {
      (comp as any).player = {
        play: jasmine.createSpy('play'),
      };
    });

    it('should not play video if user is not logged in', () => {
      comp.autoplay = true;
      comp.isModal = false;
      (comp as any).session.getLoggedInUser.and.returnValue(null);

      comp.onEnterViewport();

      expect(comp.isInViewport).toBeTruthy();
      expect(comp.player.play).not.toHaveBeenCalled();
    });

    it('should not play video if autoplay is disabled', () => {
      comp.autoplay = false;
      comp.isModal = false;
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: '123',
        disable_autoplay_videos: false,
      });

      comp.onEnterViewport();

      expect(comp.isInViewport).toBeTruthy();
      expect(comp.player.play).not.toHaveBeenCalled();
    });

    it('should not play video if user has autoplay disabled', () => {
      comp.autoplay = true;
      comp.isModal = false;
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: '123',
        disable_autoplay_videos: true,
      });

      comp.onEnterViewport();

      expect(comp.isInViewport).toBeTruthy();
      expect(comp.player.play).not.toHaveBeenCalled();
    });

    it('should play video if user is logged in and autoplay is enabled', () => {
      comp.autoplay = true;
      comp.isModal = false;
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: '123',
        disable_autoplay_videos: false,
      });

      comp.onEnterViewport();

      expect(comp.isInViewport).toBeTruthy();
      expect(comp.player.play).toHaveBeenCalledWith({
        muted: true,
        hideControls: true,
      });
    });

    it('should play unmuted video if in modal', () => {
      comp.autoplay = true;
      comp.isModal = true;
      (comp as any).session.getLoggedInUser.and.returnValue({
        guid: '123',
        disable_autoplay_videos: false,
      });

      comp.onEnterViewport();

      expect(comp.isInViewport).toBeTruthy();
      expect(comp.player.play).toHaveBeenCalledWith({
        muted: false,
        hideControls: true,
      });
    });
  });
});
