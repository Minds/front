import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { AttachmentPreviewAudioComponent } from './attachment-preview-audio.component';
import { ComposerService } from '../../../services/composer.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MockService } from '../../../../../utils/mock';

describe('AttachmentPreviewAudioComponent', () => {
  let comp: AttachmentPreviewAudioComponent;
  let fixture: ComponentFixture<AttachmentPreviewAudioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttachmentPreviewAudioComponent],
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
        { provide: ToasterService, useValue: MockService(ToasterService) },
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

  describe('showControlDisabledToast', () => {
    it('should call toastService.inform with correct message', () => {
      (comp as any).showControlDisabledToast();
      expect((comp as any).toastService.inform).toHaveBeenCalledWith(
        'Playback is only available after a post has been made'
      );
    });
  });

  describe('removeAttachment', () => {
    it('should call composerService.removeAudioAttachment', () => {
      (comp as any).removeAttachment();
      expect(
        (comp as any).composerService.removeAudioAttachment
      ).toHaveBeenCalled();
    });
  });
});
