import { SendWyreService } from './sendwyre.service';
import { SendWyreConfig } from './sendwyre.interface';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { MockService } from '../../../utils/mock';
import { SiteService } from '../../../common/services/site.service';
import { ConfigsService } from '../../../common/services/configs.service';

describe('BlockchainService', () => {
  let service: SendWyreService;

  const siteServiceMock: any = MockService(SiteService);

  const configsServiceMock: any = MockService(ConfigsService);

  const sendWyreConfigMock: SendWyreConfig = {
    paymentMethod: 'debit-card',
    accountId: 'X',
    dest: `0x`,
    destCurrency: 'ETH',
    sourceAmount: '40',
    redirectUrl: `https://minds.com/token`,
    failureRedirectUrl: `https://minds.com/token?purchaseFailed=true`,
  };

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new SendWyreService(
      sessionMock,
      siteServiceMock,
      configsServiceMock
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
  });

  // Fix when we enable deeper integrations.
  xit('should redirect the user when buy called', () => {
    service.redirect(sendWyreConfigMock);
    expect(service.amountUsd).toBe('40');
    expect(window.location.assign).toHaveBeenCalled();
  });

  it('should build args into querystring', () => {
    configsServiceMock.get = {
      baseUrl: 'https://pay.sendwyre.com/',
    };
    const expectedString =
      'https://pay.sendwyre.com/?paymentMethod' +
      '=debit-card&accountId=X&dest=0x&destCurrency=ETH&sourceAmount' +
      '=40&redirectUrl=https://minds.com/token&failureRedirectUrl=' +
      'https://minds.com/token?purchaseFailed=true';
    expect(service.getUrl(sendWyreConfigMock)).toBe(expectedString);
  });
});
