import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminConsoleMobilePreviewBuilderComponent } from './preview-builder.component';
import { SITE_NAME } from '../../../../../../../common/injection-tokens/common-injection-tokens';
import { MobileAppPreviewService } from '../../services/mobile-app-preview.service';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { MobilePreviewStatusEnum } from '../../../../../../../../graphql/generated.engine';

describe('NetworkAdminConsoleMobilePreviewBuilderComponent', () => {
  let comp: NetworkAdminConsoleMobilePreviewBuilderComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleMobilePreviewBuilderComponent>;

  const mockPreviewCodeUrl: string = 'https://example-qr.minds.com';

  beforeEach((done) => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminConsoleMobilePreviewBuilderComponent,
        MockComponent({
          selector: 'm-button',
          template: '<ng-content></ng-content>',
          inputs: ['color', 'solid', 'saving', 'disabled', 'size'],
          outputs: ['onAction'],
        }),
        MockComponent({
          selector: 'm-qr-code',
          inputs: ['data', 'width'],
        }),
      ],
      providers: [
        {
          provide: MobileAppPreviewService,
          useValue: MockService(MobileAppPreviewService, {
            has: ['previewStatus$', 'previewQRCode$'],
            props: {
              previewStatus$: {
                get: () =>
                  new BehaviorSubject<MobilePreviewStatusEnum>(
                    MobilePreviewStatusEnum.Pending
                  ),
              },
              previewQRCode$: {
                get: () => new BehaviorSubject<string>(mockPreviewCodeUrl),
              },
            },
          }),
        },
        { provide: SITE_NAME, useValue: 'https://example.minds.com' },
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminConsoleMobilePreviewBuilderComponent
    );
    comp = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to build preview on build click', () => {
    comp.onBuildClick();
    expect(
      (comp as any).MobileAppPreviewService.buildPreview
    ).toHaveBeenCalled();
  });

  it('should show sitename as subtitle', () => {
    expect(
      fixture.nativeElement
        .querySelector('.m-networkPreviewBuilder__subtitle')
        .textContent.trim()
    ).toEqual(comp.siteName);
  });

  describe('status marker', () => {
    it('should have correct status marker for no preview state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.NoPreview
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--noPreview'
        )
      ).toBeTruthy();

      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--pending'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--ready'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--error'
        )
      ).toBeFalsy();
    });

    it('should have correct status marker for pending state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Pending
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--pending'
        )
      ).toBeTruthy();

      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--noPreview'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--ready'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--error'
        )
      ).toBeFalsy();
    });

    it('should have correct status marker for ready state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Ready
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--ready'
        )
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--noPreview'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--pending'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--error'
        )
      ).toBeFalsy();
    });

    it('should have correct status marker for error state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Error
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--error'
        )
      ).toBeTruthy();

      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--noPreview'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--pending'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__statusMarker--ready'
        )
      ).toBeFalsy();
    });
  });

  describe('preview status text', () => {
    it('should have correct preview status text for no preview state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.NoPreview
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('.m-networkPreviewBuilder__statusContainer span')
          .textContent.trim()
      ).toBe('No preview build generated');
    });
    it('should have correct preview status text for pending state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Pending
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('.m-networkPreviewBuilder__statusContainer span')
          .textContent.trim()
      ).toBe('Generating preview');
    });

    it('should have correct preview status text for ready state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Ready
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('.m-networkPreviewBuilder__statusContainer span')
          .textContent.trim()
      ).toBe('Your preview build is ready');
    });

    it('should have correct preview status text for error state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Error
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('.m-networkPreviewBuilder__statusContainer span')
          .textContent.trim()
      ).toBe('Your preview build failed');
    });
  });

  describe('description', () => {
    it('should have correct description for pending state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Pending
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('.m-networkPreviewBuilder__descriptionContainer span')
          .textContent.trim()
      ).toBe(
        'We are currently generating a preview for you to view soon. In the meantime, download our previewer app'
      );

      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__descriptionContainer .m-networkPreviewBuilder__iosLink'
        )
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__descriptionContainer .m-networkPreviewBuilder__androidLink'
        )
      ).toBeTruthy();
    });

    it('should have correct description for ready state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Ready
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('.m-networkPreviewBuilder__descriptionContainer span')
          .textContent.trim()
      ).toBe(
        'To view the preview of your network site, first get the Minds previewer app on'
      );

      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__descriptionContainer .m-networkPreviewBuilder__iosLink'
        )
      ).toBeTruthy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__descriptionContainer .m-networkPreviewBuilder__androidLink'
        )
      ).toBeTruthy();
    });

    it('should have NO description for error state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Error
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__descriptionContainer span'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__descriptionContainer .m-networkPreviewBuilder__iosLink'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__descriptionContainer .m-networkPreviewBuilder__androidLink'
        )
      ).toBeFalsy();
    });

    it('should have NO description for no preview state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.NoPreview
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__descriptionContainer span'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__descriptionContainer .m-networkPreviewBuilder__iosLink'
        )
      ).toBeFalsy();
      expect(
        fixture.nativeElement.querySelector(
          '.m-networkPreviewBuilder__descriptionContainer .m-networkPreviewBuilder__androidLink'
        )
      ).toBeFalsy();
    });
  });

  describe('QR container', () => {
    it('should have qr containter in ready state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Ready
      );
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('m-qr-code')).toBeTruthy();
    });

    it('should NOT have qr containter in pending state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Pending
      );
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('m-qr-code')).toBeFalsy();
    });

    it('should NOT have qr containter in no preview state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.NoPreview
      );
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('m-qr-code')).toBeFalsy();
    });

    it('should NOT have qr containter in error state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Error
      );
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('m-qr-code')).toBeFalsy();
    });
  });

  describe('cta button', () => {
    it('should have correct cta button for pending state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Pending
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('.m-networkPreviewBuilder__button')
          .textContent.trim()
      ).toBe('Building preview');
    });

    it('should have correct cta button for ready state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Ready
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('.m-networkPreviewBuilder__button')
          .textContent.trim()
      ).toBe('Build a new preview');
    });

    it('should have correct cta button for error state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.Error
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('.m-networkPreviewBuilder__button')
          .textContent.trim()
      ).toBe('Rebuild preview');
    });

    it('should have correct cta button for no preview state', () => {
      (comp as any).MobileAppPreviewService.previewStatus$.next(
        MobilePreviewStatusEnum.NoPreview
      );
      fixture.detectChanges();

      expect(
        fixture.nativeElement
          .querySelector('.m-networkPreviewBuilder__button')
          .textContent.trim()
      ).toBe('Build preview');
    });
  });
});
