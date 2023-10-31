import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradePageComponent } from './upgrade-page.component';
import { ConfigsService } from '../../../common/services/configs.service';
import { MockService } from '../../../utils/mock';
import { ModalService } from '../../../services/ux/modal.service';
import { UpgradePageGQL } from '../../../../graphql/generated.strapi';
import { WirePaymentHandlersService } from '../../wire/wire-payment-handlers.service';

describe('UpgradePageComponent', () => {
  let component: UpgradePageComponent;
  let fixture: ComponentFixture<UpgradePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpgradePageComponent],
      providers: [
        {
          provide: ModalService,
          useValue: MockService(ModalService),
        },
        {
          provide: UpgradePageGQL,
          useValue: MockService(UpgradePageGQL),
        },
        {
          provide: WirePaymentHandlersService,
          useValue: MockService(WirePaymentHandlersService),
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpgradePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
