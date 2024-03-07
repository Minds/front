import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CopyToClipboardService } from './copy-to-clipboard.service';
import { WINDOW } from '../injection-tokens/common-injection-tokens';

describe('CopyToClipboardService', () => {
  let service: CopyToClipboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CopyToClipboardService,
        {
          provide: WINDOW,
          useValue: {
            navigator: {
              clipboard: {
                writeText: jasmine.createSpy('writeText'),
              },
            },
          },
        },
      ],
    });

    service = TestBed.inject(CopyToClipboardService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should call to write text onto clipboard', fakeAsync(() => {
    const text: string = 'Test text';

    service.copyToClipboard(text);
    tick();

    expect(
      (service as any).window.navigator.clipboard.writeText
    ).toHaveBeenCalledWith(text);
  }));
});
