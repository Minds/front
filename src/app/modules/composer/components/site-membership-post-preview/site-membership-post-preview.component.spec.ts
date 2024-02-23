import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ComposerSiteMembershipPostPreview } from './site-membership-post-preview.component';
import {
  ComposerService,
  ComposerSize,
  PaywallThumbnail,
} from '../../services/composer.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { MockService } from '../../../../utils/mock';
import { ToasterService } from '../../../../common/services/toaster.service';

describe('ComposerSiteMembershipPostPreview', () => {
  let component: ComposerSiteMembershipPostPreview;
  let fixture: ComponentFixture<ComposerSiteMembershipPostPreview>;

  const size$ = new BehaviorSubject<ComposerSize>('full');
  const title$ = new BehaviorSubject(null);
  const richEmbedTitle$ = new BehaviorSubject(null);
  const paywallThumbnail$ = new BehaviorSubject(false);

  const composerServiceMock: any = MockService(ComposerService, {
    has: ['size$', 'title$', 'richEmbedTitle$', 'paywallThumbnail$'],
    props: {
      size$: { get: () => size$ },
      title$: { get: () => title$ },
      richEmbedTitle$: { get: () => richEmbedTitle$ },
      paywallThumbnail$: { get: () => paywallThumbnail$ },
    },
  });

  beforeEach(async () => {
    size$.next('full');
    title$.next(null);
    richEmbedTitle$.next(null);
    paywallThumbnail$.next(false);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NoopAnimationsModule],
      declarations: [ComposerSiteMembershipPostPreview],
      providers: [
        { provide: ComposerService, useValue: composerServiceMock },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComposerSiteMembershipPostPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the title in the form when title$ has a value', () => {
    let mockTitle = 'Test Title';
    (component.service as any).title$.next(mockTitle);
    expect(component.postPreviewForm.get('title').value).toBe(mockTitle);
  });

  it('should initialize the title in the form when richEmbedTitle$ has a value', () => {
    let mockTitle = 'Test Rich Embed Title';
    (component.service as any).richEmbedTitle$.next(mockTitle);
    expect(component.postPreviewForm.get('title').value).toBe(mockTitle);
  });

  it('should emit onPost event and update service on valid form submission', () => {
    const mockTitle = 'Test Title';
    const mockFile = new File([''], 'test.png', { type: 'image/png' });
    const mockThumbnail: PaywallThumbnail = {
      url: URL.createObjectURL(mockFile),
      file: mockFile,
      fileBase64: 'data:image/png;base64,asdfqwerty....',
    };

    component.postPreviewForm.controls['title'].setValue(mockTitle);
    component.paywallThumbnail = mockThumbnail;

    spyOn(component.onPostEmitter, 'emit');
    spyOn(component.service.title$, 'next');
    spyOn(component.service.paywallThumbnail$, 'next');

    component.onSubmit(new MouseEvent('click'));

    expect(component.onPostEmitter.emit).toHaveBeenCalled();
    expect(component.service.title$.next).toHaveBeenCalledWith(mockTitle);
    expect(component.service.paywallThumbnail$.next).toHaveBeenCalledWith(
      mockThumbnail
    );
  });
});
