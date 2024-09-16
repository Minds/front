import { TestBed } from '@angular/core/testing';
import { CalDotComService } from './caldotcom.service';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';

describe('CalDotComService', () => {
  let service: CalDotComService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalDotComService,
        {
          provide: DOCUMENT,
          useValue: jasmine.createSpyObj('Document', [
            'createElement',
            'getElementsByTagName',
          ]),
        },
        {
          provide: WINDOW,
          useValue: jasmine.createSpyObj('Window', [], {
            Cal: jasmine.createSpy('Cal'),
          }),
        },
      ],
    });

    service = TestBed.inject(CalDotComService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadScript', () => {
    it('should create and insert script element', () => {
      let mockScriptElement: jasmine.SpyObj<HTMLScriptElement> =
        jasmine.createSpyObj('HTMLScriptElement', [], {
          parentNode: jasmine.createSpyObj('Node', ['insertBefore']),
        });
      let mockParentNode: jasmine.SpyObj<Node> =
        mockScriptElement.parentNode as any;

      (service as any).document.getElementsByTagName.and.returnValue([
        mockScriptElement,
      ] as any);
      (service as any).document.createElement.and.returnValue(
        mockScriptElement
      );

      service.loadScript();

      expect((service as any).document.createElement).toHaveBeenCalledWith(
        'script'
      );
      expect(mockScriptElement.src).toBe('/static/en/assets/scripts/cal.js');
      expect(mockScriptElement.defer).toBeTrue();
      expect(mockScriptElement.async).toBeTrue();
      expect(mockParentNode.insertBefore).toHaveBeenCalledWith(
        mockScriptElement,
        mockScriptElement
      );

      (mockScriptElement as any).onload();
      expect(service.scriptLoaded$.getValue()).toBeTrue();
    });

    it('should not reload script if already loaded', () => {
      service.scriptLoaded$.next(true);
      service.loadScript();
      expect((service as any).document.createElement).not.toHaveBeenCalled();
    });
  });

  describe('initializeCalendar', () => {
    it('should call Cal.init and Cal.ns with correct parameters', () => {
      const namespace: string = 'testNamespace';
      (service as any).window.Cal.ns = [];
      (service as any).window.Cal.ns[namespace] = jasmine.createSpy();

      service.initializeCalendar(namespace);

      expect((service as any).window.Cal).toHaveBeenCalledWith(
        'init',
        namespace,
        {
          origin: 'https://cal.com',
        }
      );
      expect((service as any).window.Cal.ns[namespace]).toHaveBeenCalledWith(
        'ui',
        {
          styles: {
            branding: {
              brandColor: '#000000',
            },
          },
          hideEventTypeDetails: false,
          layout: 'month_view',
        }
      );
    });
  });
});
