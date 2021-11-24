import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Session } from 'inspector';
import { featuresServiceMock } from '../../../../tests/features-service-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { themeServiceMock } from '../../../mocks/common/services/theme.service-mock.spec';
import { EarnModalService } from '../../../modules/blockchain/earn/earn-modal.service';
import { BuyTokensModalService } from '../../../modules/blockchain/token-purchase/v2/buy-tokens-modal.service';
import { Web3WalletService } from '../../../modules/blockchain/web3-wallet.service';
import { BoostModalLazyService } from '../../../modules/boost/modal/boost-modal-lazy.service';
import { FeaturesService } from '../../../services/features.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { ThemeService } from '../../services/theme.service';

import { SidebarMoreComponent } from './sidebar-more.component';

describe('SidebarMoreComponent', () => {
  let component: SidebarMoreComponent;
  let fixture: ComponentFixture<SidebarMoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SidebarMoreComponent,
        MockComponent({
          selector: 'm-icon',
        }),
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ChangeDetectorRef, useValue: ChangeDetectorRef },
        { provide: ThemeService, useValue: themeServiceMock },
        { provide: FeaturesService, useValue: featuresServiceMock },
        {
          provide: Web3WalletService,
          useValue: MockService(Web3WalletService),
        },
        {
          provide: BuyTokensModalService,
          useValue: MockService(BuyTokensModalService),
        },
        {
          provide: EarnModalService,
          useValue: MockService(EarnModalService),
        },
        {
          provide: BoostModalLazyService,
          useValue: MockService(BoostModalLazyService),
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarMoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
