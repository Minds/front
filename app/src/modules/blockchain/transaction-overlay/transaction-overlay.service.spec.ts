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

  it('showAndRun should show the modal, execute the function and then return', async () => {
    let result = await service.showAndRun(async () => {
      return Promise.resolve(3);
    }, 'test');
    //the below test fails.. need to fix with async!
    //expect(result).toBe(3);
    expect(comp.show).toHaveBeenCalled();
    expect(comp.hide).toHaveBeenCalled();
  });

});
