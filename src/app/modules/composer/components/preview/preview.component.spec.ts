import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ComposerService } from '../../services/composer.service';
import { PreviewComponent } from './preview.component';

describe('Composer Preview', () => {
  let comp: PreviewComponent;
  let fixture: ComponentFixture<PreviewComponent>;

  const composerServiceMock: any = MockService(ComposerService, {
    removeAttachment: true,
  });

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          PreviewComponent,
          MockComponent({
            selector: 'm-icon',
            inputs: ['from', 'iconId', 'sizeFactor'],
          }),
          MockComponent({
            selector: 'm-composerAttachmentPreview',
            inputs: ['attachmentPreviewResource'],
            outputs: ['onPortraitOrientation'],
          }),
          MockComponent({
            selector: 'm-composerRichEmbedPreview',
            inputs: ['richEmbed'],
          }),
          MockComponent({
            selector: 'm-composer__coverPhotoSelector',
          }),
        ],
        providers: [
          {
            provide: ComposerService,
            useValue: composerServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(PreviewComponent);
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
    comp.removeAttachment();
    expect(window.confirm).toHaveBeenCalled();
    expect(composerServiceMock.removeAttachment).toHaveBeenCalled();
  });

  it('should remove a rich embed', () => {
    fixture.detectChanges();
    comp.removeRichEmbed();
    expect(composerServiceMock.removeRichEmbed).toHaveBeenCalled();
  });
});
