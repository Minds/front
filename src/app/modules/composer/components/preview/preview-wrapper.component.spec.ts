import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { AttachmentApiService } from '../../../../common/api/attachment-api.service';
import fileMock from '../../../../mocks/dom/file.mock';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ComposerService } from '../../services/composer.service';
import { PreviewWrapperComponent } from './preview-wrapper.component';

describe('Composer Preview', () => {
  let comp: PreviewWrapperComponent;
  let fixture: ComponentFixture<PreviewWrapperComponent>;

  const composerServiceMock: any = MockService(ComposerService, {
    removeAttachment(file: File) {
      return true;
    },
    //
    has: ['attachmentPreviews$', 'richEmbedPreview$', 'videoPermissionsError$'],
    props: {
      attachmentPreviews$: { get: () => new Subject() },
      richEmbedPreview$: { get: () => new Subject() },
      videoPermissionsError$: {
        get: () => new BehaviorSubject<boolean>(false),
      }, // Provide an initial value if needed
    },
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        PreviewWrapperComponent,
        MockComponent({
          selector: 'm-icon',
          inputs: ['from', 'iconId', 'sizeFactor'],
        }),
        MockComponent({
          selector: 'm-composerPreview--attachment',
          inputs: ['attachmentPreviewResource'],
          outputs: ['onPortraitOrientation'],
        }),
        MockComponent({
          selector: 'm-composerPreview--richEmbed',
          inputs: ['richEmbed'],
        }),
      ],
      providers: [
        {
          provide: ComposerService,
          useValue: composerServiceMock,
        },
        {
          provide: AttachmentApiService,
          useValue: MockService(AttachmentApiService, {
            has: ['videoPermissionsError$'],
            props: {
              videoPermissionsError$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(PreviewWrapperComponent);
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

  it('should remove an attachment', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges();
    const image = fileMock('image');
    comp.removeAttachment(image);
    expect(window.confirm).toHaveBeenCalled();
  });

  it('should remove a rich embed', () => {
    fixture.detectChanges();
    comp.removeRichEmbed();
    expect(composerServiceMock.removeRichEmbed).toHaveBeenCalled();
  });
});
