import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { BlogEditorComponent } from './editor.component';
import { PLATFORM_ID } from '@angular/core';
import { CDN_URL } from '../../../../../common/injection-tokens/url-injection-tokens';
import { AttachmentService } from '../../../../../services/attachment';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { ThemeService } from '../../../../../common/services/theme.service';

describe('BlogEditorComponent', () => {
  let comp: BlogEditorComponent;
  let fixture: ComponentFixture<BlogEditorComponent>;
  let cdnUrl: string = 'https://example-cdn.minds.com/';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BlogEditorComponent,
        MockComponent({
          selector: 'm-ckeditor',
          inputs: ['ngModel', 'editor'],
          outputs: ['ngModelChange'],
        }),
      ],
      providers: [
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
        {
          provide: AttachmentService,
          useValue: MockService(AttachmentService),
        },
        {
          provide: ThemeService,
          useValue: MockService(ThemeService, {
            has: ['isDark$'],
            props: {
              isDark$: {
                get: () => new BehaviorSubject<boolean>(true),
              },
            },
          }),
        },
        {
          provide: CDN_URL,
          useValue: cdnUrl,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogEditorComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should handle file uploads', async () => {
    const imageGuid: string = '1234567890112233';
    (comp as any).attachment.upload.and.returnValue(imageGuid);
    const file: File = new File([''], 'test.png', { type: 'image/png' });

    expect(await comp.Editor.config.uploadHandler(file)).toBe(
      `${cdnUrl}fs/v1/thumbnail/${imageGuid}/xlarge`
    );
    expect((comp as any).attachment.upload).toHaveBeenCalledWith(file);
  });
});
