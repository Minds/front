import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockService } from '../../../../utils/mock';
import { ConfigsService } from '../../../../common/services/configs.service';
import { AttachmentPreviewComponent } from './attachment-preview.component';

describe('Composer Attachment Preview', () => {
  let comp: AttachmentPreviewComponent;
  let fixture: ComponentFixture<AttachmentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttachmentPreviewComponent],
      providers: [
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(AttachmentPreviewComponent);
    comp = fixture.componentInstance;
    spyOn(comp.onPortraitOrientationEmitter, 'emit').and.stub();
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

  it('should set portrait for an image', () => {
    const img = document.createElement('img');
    spyOnProperty(img, 'naturalWidth').and.returnValue(1000);
    spyOnProperty(img, 'naturalHeight').and.returnValue(2000);
    fixture.detectChanges();

    comp.fitForImage(img);
    expect(comp.onPortraitOrientationEmitter.emit).toHaveBeenCalledWith(true);
  });

  it('should set landscape for an image', () => {
    const img = document.createElement('img');
    spyOnProperty(img, 'naturalWidth').and.returnValue(2000);
    spyOnProperty(img, 'naturalHeight').and.returnValue(1000);
    fixture.detectChanges();

    comp.fitForImage(img);
    expect(comp.onPortraitOrientationEmitter.emit).toHaveBeenCalledWith(false);
  });

  it('should set portrait for an video', () => {
    const video = document.createElement('video');
    spyOnProperty(video, 'videoWidth').and.returnValue(1000);
    spyOnProperty(video, 'videoHeight').and.returnValue(2000);
    fixture.detectChanges();

    comp.fitForVideo(video);
    expect(comp.onPortraitOrientationEmitter.emit).toHaveBeenCalledWith(true);
  });

  it('should set landscape for an video', () => {
    const video = document.createElement('video');
    spyOnProperty(video, 'videoWidth').and.returnValue(2000);
    spyOnProperty(video, 'videoHeight').and.returnValue(1000);
    fixture.detectChanges();

    comp.fitForVideo(video);
    expect(comp.onPortraitOrientationEmitter.emit).toHaveBeenCalledWith(false);
  });
});
