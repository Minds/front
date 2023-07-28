import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { MockService } from '../../../utils/mock';
import { GiftCardComponent } from './gift-card.component';
import { ThemeService } from '../../../common/services/theme.service';
import {
  GiftCardNode,
  GiftCardProductIdEnum,
} from '../../../../graphql/generated.engine';

describe('GiftCardComponent', () => {
  let comp: GiftCardComponent;
  let fixture: ComponentFixture<GiftCardComponent>;
  const mockGiftCardNode: GiftCardNode = {
    __typename: 'GiftCardNode',
    amount: 9.99,
    balance: 9.99,
    claimedAt: null,
    claimedByGuid: null,
    expiresAt: 32519535585,
    guid: '1234567890',
    id: '2345678901',
    issuedAt: 1688386785,
    issuedByGuid: '3456789012',
    productId: GiftCardProductIdEnum.Boost,
    transactions: null,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GiftCardComponent],
      providers: [
        {
          provide: ThemeService,
          useValue: MockService(ThemeService, {
            has: ['isDark$'],
            props: {
              isDark$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
      ],
    });

    fixture = TestBed.createComponent(GiftCardComponent);
    comp = fixture.componentInstance;
    comp.giftCardNode = mockGiftCardNode;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('cardText', () => {
    it('should get card text for a Boost', () => {
      comp.giftCardNode.productId = GiftCardProductIdEnum.Boost;
      expect(comp.cardText).toEqual('Boost Credits Gift');
    });

    it('should get card text for a Plus', () => {
      comp.giftCardNode.productId = GiftCardProductIdEnum.Plus;
      expect(comp.cardText).toEqual('Minds+ Credits Gift');
    });

    it('should get card text for a Pro', () => {
      comp.giftCardNode.productId = GiftCardProductIdEnum.Pro;
      expect(comp.cardText).toEqual('Minds Pro Credits Gift');
    });

    it('should get card text for a Supermind', () => {
      comp.giftCardNode.productId = GiftCardProductIdEnum.Supermind;
      expect(comp.cardText).toEqual('Supermind Credits Gift');
    });

    it('should get card text for a other', () => {
      comp.giftCardNode.productId = null;
      expect(comp.cardText).toEqual('Minds Credits Gift');
    });
  });
});
