import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Injector } from '@angular/core';

import { UpsellModalComponent } from './upsell-modal.component';
import { MockService } from '../../../../utils/mock';
import { ModalService } from '../../../../services/ux/modal.service';
import { RouterTestingModule } from '@angular/router/testing';
import { WirePaymentHandlersService } from '../../../wire/wire-payment-handlers.service';
import { WireModalService } from '../../../wire/wire-modal.service';

describe('UpsellModalComponent', () => {
  let component: UpsellModalComponent;
  let fixture: ComponentFixture<UpsellModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpsellModalComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: WirePaymentHandlersService,
          useValue: MockService(WirePaymentHandlersService),
        },
        { provide: WireModalService, useValue: MockService(WireModalService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsellModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
