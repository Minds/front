import { SendWyreService } from './sendwyre.service';
import { SendWyreConfig } from './sendwyre.interface';
import { MockService } from '../../../utils/mock';
import { SiteService } from '../../../common/services/site.service';
import { clientMock } from '../../../../tests/client-mock.spec';
import { ToasterService } from '../../../common/services/toaster.service';

describe('SendWyreService', () => {
  let service: SendWyreService;

  const toasterMock: any = MockService(ToasterService);

  const sendWyreConfigMock: SendWyreConfig = {
    dest: `0x`,
    destCurrency: 'ETH',
    sourceCurrency: 'USD',
    amount: '',
  };

  const returnUrl: string =
    'https://pay.testwyre.com/?paymentMethod' +
    '=debit-card&accountId=X&dest=0x&destCurrency=ETH&sourceAmount' +
    '=40&redirectUrl=https://minds.com/token&failureRedirectUrl=' +
    'https://minds.com/token?purchaseFailed=true';

  beforeEach(() => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    service = new SendWyreService(clientMock, toasterMock);

    clientMock.response = [];

    clientMock.response[`api/v2/sendwyre`] = {
      status: 'success',
      url: returnUrl,
    };
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

  it('should get url from  API', async () => {
    expect(await (service as any).getRedirectUrl(sendWyreConfigMock)).toBe(
      returnUrl
    );
  });
});
