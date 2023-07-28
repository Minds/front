import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { GiftCardService } from '../../../gift-card/gift-card.service';
import { MockComponent } from '../../../../utils/mock';
import { WalletV2CreditsComponent } from './credits.component';

describe('WalletV2CreditsComponent', () => {
  let fixture: ComponentFixture<WalletV2CreditsComponent>;
  let comp: WalletV2CreditsComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        WalletV2CreditsComponent,
        MockComponent({ selector: 'm-walletV2__creditsSummary' }),
      ],
    });

    fixture = TestBed.createComponent(WalletV2CreditsComponent);
    comp = fixture.componentInstance;
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });
});
