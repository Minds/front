import { clientMock } from '../../../../tests/client-mock.spec';
import { DiscoveryTagsService } from './tags.service';

let hashtagDefaultsMock = new (function () {})();
let discoveryServiceMock = new (function () {})();
let experimentsServiceMock = new (function () {})();
let configMock = new (function () {
  this.get = jasmine.createSpy('get');
})();

describe('DiscoveryTagsService', () => {
  let service: DiscoveryTagsService;

  beforeEach(() => {
    service = new DiscoveryTagsService(
      clientMock,
      hashtagDefaultsMock,
      discoveryServiceMock,
      experimentsServiceMock,
      configMock,
      null // platformId
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should check if user has set tags', async () => {
    service.inProgress$.next(false);
    service.loaded$.next(true);
    service.tags$.next([1, 2]);
    expect(await service.hasSetTags()).toBeTrue();
  });

  it('should check if user has NOT set tags', async () => {
    service.inProgress$.next(false);
    service.loaded$.next(true);
    service.tags$.next([]);
    expect(await service.hasSetTags()).toBeFalse();
  });

  it('should remove a tag from the trending list', () => {
    service.trending$.next([
      { value: 'tag1' },
      { value: 'tag2' },
      { value: 'tag3' },
    ]);
    service.removeTagFromTrending({ value: 'tag2' });
    expect(service.trending$.value).toEqual([
      { value: 'tag1' },
      { value: 'tag3' },
    ]);
  });
});
