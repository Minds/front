import { TestBed } from '@angular/core/testing';
import { DEFAULT_ERROR_MESSAGE, ToasterService } from './toaster.service';
import { BehaviorSubject } from 'rxjs';

describe('ToasterService', () => {
  let service: ToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToasterService],
    });

    service = TestBed.inject(ToasterService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('error', () => {
    it('should handle error strings', () => {
      (service as any).subject = new BehaviorSubject<string>(null);

      const error: string | any = 'test error';
      service.error(error);

      expect((service as any).subject.getValue()).toEqual({
        type: 'error',
        message: error,
      });
    });

    it('should handle GraphQL error objects', () => {
      (service as any).subject = new BehaviorSubject<string>(null);

      const errorMessage: string = 'test error';
      const error: string | any = {
        error: {
          errors: [{ message: errorMessage }],
        },
      };
      service.error(error);

      expect((service as any).subject.getValue()).toEqual({
        type: 'error',
        message: errorMessage,
      });
    });

    it('should handle general error objects with nested error', () => {
      (service as any).subject = new BehaviorSubject<string>(null);

      const errorMessage: string = 'test error';
      const error: string | any = {
        error: { message: errorMessage },
      };
      service.error(error);

      expect((service as any).subject.getValue()).toEqual({
        type: 'error',
        message: errorMessage,
      });
    });

    it('should handle general error objects with root level error message', () => {
      (service as any).subject = new BehaviorSubject<string>(null);

      const errorMessage: string = 'test error';
      const error: string | any = { message: errorMessage };
      service.error(error);

      expect((service as any).subject.getValue()).toEqual({
        type: 'error',
        message: errorMessage,
      });
    });

    it('should handle general error objects with default error message', () => {
      (service as any).subject = new BehaviorSubject<string>(null);

      const errorMessage: string = DEFAULT_ERROR_MESSAGE;
      const error: string | any = {
        test: {
          test: 'test',
        },
      };
      service.error(error);

      expect((service as any).subject.getValue()).toEqual({
        type: 'error',
        message: errorMessage,
      });
    });

    it('should handle null error objects with default error message', () => {
      (service as any).subject = new BehaviorSubject<string>(null);

      const errorMessage: string = DEFAULT_ERROR_MESSAGE;
      const error: string | any = null;
      service.error(error);

      expect((service as any).subject.getValue()).toEqual({
        type: 'error',
        message: errorMessage,
      });
    });
  });
});
