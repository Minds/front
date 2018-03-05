import { TransactionOverlayService } from './transaction-overlay.service';

describe('TransactionOverlayService', () => {

  let service: TransactionOverlayService;
  let comp: any = <any>{
    show: jasmine.createSpy('show'),
    hide: jasmine.createSpy('hide')
  };

  beforeEach(() => {
    service = new TransactionOverlayService();
    service.setComponent(comp);
  });

  it('should be instantiated', () => {
    expect(service).toBeTruthy();
    expect(comp).toBeTruthy();
  });

  // TODO: Find a way to test modals
});
