import { TestBed } from '@angular/core/testing';
import { CalDotComService } from './caldotcom.service';
import { WINDOW } from '../../../../../common/injection-tokens/common-injection-tokens';

describe('CalDotComService', () => {
  let service: CalDotComService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalDotComService,
        {
          provide: WINDOW,
          useValue: {
            Cal: jasmine.createSpy('Cal').and.callFake(() => {}),
          },
        },
      ],
    });

    service = TestBed.inject(CalDotComService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadScript', () => {
    it('should set up Cal object and set scriptLoaded$ to true', () => {
      spyOn(console, 'info');
      service.loadScript();

      expect((service as any).loaded).toBeTrue();
      expect(console.info).not.toHaveBeenCalled();
    });

    it('should not reload script if already loaded', () => {
      spyOn(console, 'info');

      service.loadScript();
      service.loadScript();

      expect(console.info).toHaveBeenCalledWith(
        'Did not reload cal.com script - it is already loaded'
      );
    });
  });

  describe('initializeCalendar', () => {
    it('should call Cal with correct parameters', () => {
      const namespace = 'testNamespace';
      (service as any).window.Cal.ns = {
        [namespace]: jasmine.createSpy('namespaceFn'),
      };

      service.initializeCalendar(namespace);

      expect((service as any).window.Cal).toHaveBeenCalledWith(
        'init',
        namespace,
        { origin: 'https://cal.com' }
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
