import { PlusTierUrnService } from './plus-tier-urn.service';

describe('PlusTierUrnService', () => {
  let service: PlusTierUrnService;
  const plusTierUrn: string = 'urn:plus';

  let configMock = new (function() {
    this.get = jasmine.createSpy('get').and.returnValue({
      support_tier_urn: plusTierUrn,
    });
  })();

  beforeEach(() => {
    service = new PlusTierUrnService(configMock);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should recognise a urn matches the plus tier urn', () => {
    expect(service.isPlusTierUrn(plusTierUrn)).toBeTruthy();
  });

  it('should recognise a urn matches the plus tier urn', () => {
    expect(service.isPlusTierUrn(`not:${plusTierUrn}`)).toBeFalse();
  });
});
