import { ElementRef, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { IntersectionObserverService } from './intersection-observer.service';

describe('IntersectionObserverService', () => {
  let service: IntersectionObserverService;

  beforeEach(() => {
    service = new IntersectionObserverService(PLATFORM_ID);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an observable on create', () => {
    const obs = service.createAndObserve(new ElementRef(null));
    expect(obs).toBeInstanceOf(Observable);
  });
});
