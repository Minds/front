import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { GlobalAudioPlayerComponent } from './global-audio-player.component';
import { GlobalAudioPlayerService } from '../../services/global-audio-player.service';
import { MockService } from '../../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { AudioTrack } from '../../types/audio-player.types';

describe('GlobalAudioPlayerComponent', () => {
  let comp: GlobalAudioPlayerComponent;
  let fixture: ComponentFixture<GlobalAudioPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GlobalAudioPlayerComponent],
      providers: [
        {
          provide: GlobalAudioPlayerService,
          useValue: MockService(GlobalAudioPlayerService, {
            has: ['currentAudioSrc$', 'currentAudioTrack$'],
            props: {
              currentAudioSrc$: {
                get: () => new BehaviorSubject<string>(null),
              },
              currentAudioTrack$: {
                get: () => new BehaviorSubject<AudioTrack>(null),
              },
            },
          }),
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalAudioPlayerComponent);
    comp = fixture.componentInstance;
    (comp as any).globalAudioPlayerService.setAudioElement.and.returnValue(
      (comp as any).globalAudioPlayerService
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should initialize audio element after view init', () => {
    comp.ngAfterViewInit();
    expect(
      (comp as any).globalAudioPlayerService.setAudioElement
    ).toHaveBeenCalledWith(comp.audioElement);
    expect((comp as any).globalAudioPlayerService.init).toHaveBeenCalled();
  });

  describe('onError', () => {
    it('should handle error when no track duration', fakeAsync(() => {
      (comp as any).globalAudioPlayerService.currentAudioTrack$.next({
        src: 'test.mp3',
        duration: null,
      });

      (comp as any).onError(null);
      tick();

      expect((comp as any).toasterService.error).not.toHaveBeenCalled();
      expect((comp as any).toasterService.inform).toHaveBeenCalledWith(
        'Still processing. Please try again shortly.'
      );
    }));

    it('should handle error by doing nothing, when no track is set', fakeAsync(() => {
      (comp as any).globalAudioPlayerService.currentAudioTrack$.next(null);

      (comp as any).onError(null);
      tick();

      expect((comp as any).toasterService.error).not.toHaveBeenCalled();
      expect((comp as any).toasterService.inform).not.toHaveBeenCalled();
    }));

    it('should handle error when track has no src', fakeAsync(() => {
      (comp as any).globalAudioPlayerService.currentAudioTrack$.next({
        src: null,
        duration: 100,
      });

      (comp as any).onError(null);
      tick();

      expect((comp as any).toasterService.inform).toHaveBeenCalledOnceWith(
        'Still processing. Please try again shortly.'
      );
      expect((comp as any).toasterService.error).not.toHaveBeenCalled();
    }));

    it('should handle error when track has src and duration', fakeAsync(() => {
      (comp as any).globalAudioPlayerService.currentAudioTrack$.next({
        src: 'test.mp3',
        duration: 100,
      });

      (comp as any).onError(null);
      tick();

      expect((comp as any).toasterService.inform).not.toHaveBeenCalled();
      expect((comp as any).toasterService.error).toHaveBeenCalledWith(
        'There was an error loading this audio file'
      );
    }));
  });
});
