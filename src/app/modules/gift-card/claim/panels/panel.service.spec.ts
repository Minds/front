import { TestBed } from '@angular/core/testing';
import { GiftCardClaimPanelService } from './panel.service';
import { GiftCardProductIdEnum } from '../../../../../graphql/generated.engine';
import { GiftCardClaimPanelEnum } from './claim-panel.enum';

describe('GiftCardClaimPanelService', () => {
  let service: GiftCardClaimPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GiftCardClaimPanelService],
    });

    service = TestBed.inject(GiftCardClaimPanelService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should have default values set appropriately', () => {
    expect(service.activePanel$.getValue()).toEqual(
      GiftCardClaimPanelEnum.Redeem
    );
    expect(service.productId$.getValue()).toEqual(GiftCardProductIdEnum.Boost);
  });
});
