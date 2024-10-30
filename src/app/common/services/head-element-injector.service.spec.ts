import { TestBed } from '@angular/core/testing';
import { HeadElementInjectorService } from './head-element-injector.service';
import { DOCUMENT } from '@angular/common';

describe('HeadElementInjectorService', () => {
  let service: HeadElementInjectorService;
  let documentMock: jasmine.SpyObj<any> = {
    createElement: jasmine.createSpy('createElement'),
    head: {
      appendChild: jasmine.createSpy('appendChild'),
      querySelectorAll: jasmine.createSpy('querySelectorAll'),
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HeadElementInjectorService,
        { provide: DOCUMENT, useValue: documentMock },
      ],
    });
    service = TestBed.inject(HeadElementInjectorService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should inject element', () => {
    const elementsText: string = '<script></script>';
    const scriptElement: HTMLScriptElement = document.createElement('script');
    scriptElement.id = 'custom-element-id';
    scriptElement.type = 'text/javascript';

    (service as any).document.createElement.withArgs('div').and.returnValue({
      children: [scriptElement],
    });
    (service as any).document.createElement
      .withArgs('script')
      .and.returnValue(scriptElement);

    service.injectFromString(elementsText, false);

    expect(documentMock.createElement).toHaveBeenCalled();
    expect(documentMock.head.appendChild).toHaveBeenCalledWith(scriptElement);
  });

  it('should remove all elements', () => {
    const parentNode = {
      removeChild: jasmine.createSpy('removeChild'),
    };
    const scriptElement1 = document.createElement('script');
    Object.defineProperty(scriptElement1, 'parentNode', {
      value: parentNode,
      writable: true,
    });
    const scriptElement2 = document.createElement('script');
    Object.defineProperty(scriptElement2, 'parentNode', {
      value: parentNode,
      writable: true,
    });
    (service as any).document.head.querySelectorAll.and.returnValue([
      scriptElement1,
      scriptElement2,
    ]);

    service.removeAll();

    expect(parentNode.removeChild).toHaveBeenCalledWith(scriptElement1);
    expect(parentNode.removeChild).toHaveBeenCalledWith(scriptElement2);
  });
});
