import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AttachmentPreviewAudioComponent } from './attachment-preview-audio.component';
import { ComposerService } from '../../../services/composer.service';
import { MockComponent, MockService } from '../../../../../utils/mock';

describe('AttachmentPreviewAudioComponent', () => {
  let comp: AttachmentPreviewAudioComponent;
  let fixture: ComponentFixture<AttachmentPreviewAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AttachmentPreviewAudioComponent,
        MockComponent({
          selector: 'm-icon',
          inputs: ['iconId'],
        }),
      ],
      providers: [
        {
          provide: ComposerService,
          useValue: MockService(ComposerService, {
            has: ['audioThumbnail$', 'isEditing$', 'isPosting$'],
            props: {
              audioThumbnail$: { get: () => new BehaviorSubject<string>(null) },
              isEditing$: { get: () => new BehaviorSubject<boolean>(false) },
              isPosting$: { get: () => new BehaviorSubject<boolean>(false) },
            },
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AttachmentPreviewAudioComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize with null thumbnail', () => {
      comp.ngOnInit();
      expect((comp as any).thumbnailImageFileUrl$.getValue()).toBeNull();
    });

    it('should set thumbnail URL on init if one exists in composer service', () => {
      const url: string = 'https://example.com/thumbnail.jpg';
      (comp as any).composerService.audioThumbnail$.next(url);
      comp.ngOnInit();
      expect((comp as any).thumbnailImageFileUrl$.getValue()).toBe(
        `url(${url})`
      );
    });
  });

  describe('onThumbnailSelected', () => {
    it('should update thumbnailImageFileUrl$', fakeAsync(() => {
      (comp as any).composerService.audioThumbnail$.next(null);
      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });

      (comp as any).onThumbnailSelected(mockFile);
      tick();

      expect((comp as any).thumbnailImageFileUrl$.getValue()).toContain(
        'url(blob:'
      );
    }));
  });

  describe('removeAttachment', () => {
    it('should call composerService.removeAudioAttachment', () => {
      (comp as any).removeAttachment();
      expect(
        (comp as any).composerService.removeAudioAttachment
      ).toHaveBeenCalled();
    });
  });

  describe('src change', () => {
    it('should set the audio player', () => {
      (comp as any).onPreviewSrcUrlChange(
        'https://example.minds.com/audio.mp3'
      );
      expect((comp as any).audioPlayer).toBeDefined();
    });

    it('should not destroy the existing audio player when playing', () => {
      spyOn(comp as any, 'destroyCurrentPlayer');
      (comp as any).playing$.next(true);

      (comp as any).onPreviewSrcUrlChange(
        'https://example.minds.com/audio.mp3'
      );

      expect((comp as any).destroyCurrentPlayer).not.toHaveBeenCalled();
    });
  });

  describe('destroyCurrentPlayer', () => {
    it('should destroy the audio player', () => {
      const pauseSpy = jasmine.createSpy('pause');

      (comp as any).audioPlayer = {
        pause: pauseSpy,
      };

      (comp as any).destroyCurrentPlayer();

      expect(pauseSpy).toHaveBeenCalled();
      expect((comp as any).audioPlayer).toBeUndefined();
    });
  });

  describe('playAudio', () => {
    it('should play the audio', () => {
      (comp as any).audioPlayer = {
        play: jasmine.createSpy('play'),
        pause: jasmine.createSpy('pause'),
      };

      (comp as any).playAudio();
      expect((comp as any).audioPlayer.play).toHaveBeenCalled();
    });
  });

  describe('pauseAudio', () => {
    it('should pause the audio', () => {
      (comp as any).audioPlayer = {
        pause: jasmine.createSpy('pause'),
      };

      (comp as any).pauseAudio();
      expect((comp as any).audioPlayer.pause).toHaveBeenCalled();
    });
  });

  describe('toggleAudioPlayback', () => {
    it('should toggle the audio playback to play', () => {
      (comp as any).audioPlayer = {
        pause: jasmine.createSpy('pause'),
        play: jasmine.createSpy('play'),
      };
      (comp as any).playing$.next(false);

      (comp as any).toggleAudioPlayback();

      expect((comp as any).playing$.getValue()).toBe(true);
      expect((comp as any).audioPlayer.play).toHaveBeenCalled();
      expect((comp as any).audioPlayer.pause).not.toHaveBeenCalled();
    });

    it('should toggle the audio playback to pause', () => {
      (comp as any).audioPlayer = {
        pause: jasmine.createSpy('pause'),
        play: jasmine.createSpy('play'),
      };
      (comp as any).playing$.next(true);

      (comp as any).toggleAudioPlayback();

      expect((comp as any).playing$.getValue()).toBe(false);
      expect((comp as any).audioPlayer.pause).toHaveBeenCalled();
      expect((comp as any).audioPlayer.play).not.toHaveBeenCalled();
    });
  });

  describe('skipBackward', () => {
    it('should skip the audio backward', () => {
      (comp as any).audioPlayer = {
        currentTime: 10,
        pause: jasmine.createSpy('pause'),
      };

      (comp as any).skipBackward();
      expect((comp as any).audioPlayer.currentTime).toBe(0);
    });
  });

  describe('skipForward', () => {
    it('should skip the audio forward', () => {
      (comp as any).audioPlayer = {
        currentTime: 10,
        pause: jasmine.createSpy('pause'),
      };

      (comp as any).skipForward();
      expect((comp as any).audioPlayer.currentTime).toBe(20);
    });
  });
});
