import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../../../../../utils/mock';
import { ToasterService } from '../../../../../../../../common/services/toaster.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { BoostEmbedBuilderComponent } from './boost-embed-builder.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CopyToClipboardService } from '../../../../../../../../common/services/copy-to-clipboard.service';
import { SITE_URL } from '../../../../../../../../common/injection-tokens/url-injection-tokens';

describe('BoostEmbedBuilderComponent', () => {
  let comp: BoostEmbedBuilderComponent;
  let fixture: ComponentFixture<BoostEmbedBuilderComponent>;
  const defaultSiteUrl: string = 'https://example.minds.com/';

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        AsyncPipe,
        NgIf,
        MockComponent({
          selector: 'm-formError',
          inputs: ['errors'],
          standalone: true,
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'solid', 'disabled'],
          outputs: ['onAction'],
          standalone: true,
        }),
      ],
      providers: [
        FormBuilder,
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: CopyToClipboardService,
          useValue: MockService(CopyToClipboardService),
        },
        { provide: SITE_URL, useValue: defaultSiteUrl },
      ],
    });
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(BoostEmbedBuilderComponent);
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

  describe('generateEmbedCode', () => {
    it('should generate an embed code and show a toast message on success', () => {
      (comp as any).formGroup.setValue({ iframeWidth: 600, iframeHeight: 300 });
      comp.generateEmbedCode();
      expect((comp as any).embedCode$.getValue()).toBe(
        `<div class="minds-boost-slot" data-height="300px" data-width="600px" data-app-url="${defaultSiteUrl}plugins/embedded-boosts"></div><script async defer crossorigin="anonymous" src="${defaultSiteUrl}plugins/embedded-boosts/js/embed.min.js"></script>`
      );
      expect((comp as any).toaster.success).toHaveBeenCalledOnceWith(
        'Updated embed code dimensions.'
      );
    });

    it('should generate an embed code and NOT show a toast message on success when false is passed', () => {
      (comp as any).formGroup.setValue({ iframeWidth: 600, iframeHeight: 300 });
      comp.generateEmbedCode(false);
      expect((comp as any).embedCode$.getValue()).toBe(
        `<div class="minds-boost-slot" data-height="300px" data-width="600px" data-app-url="${defaultSiteUrl}plugins/embedded-boosts"></div><script async defer crossorigin="anonymous" src="${defaultSiteUrl}plugins/embedded-boosts/js/embed.min.js"></script>`
      );
      expect((comp as any).toaster.success).not.toHaveBeenCalled();
    });
  });

  describe('copyEmbedCodeToClipboard', () => {
    it('should copy embed code to clipboard', () => {
      const embedCode: string = '<div></div>';
      (comp as any).embedCode$.next(embedCode);
      comp.copyEmbedCodeToClipboard();
      expect(
        (comp as any).copyToClipboard.copyToClipboard
      ).toHaveBeenCalledOnceWith(embedCode);
      expect((comp as any).toaster.success).toHaveBeenCalledOnceWith(
        'Embed code copied to clipboard.'
      );
    });
  });
});
