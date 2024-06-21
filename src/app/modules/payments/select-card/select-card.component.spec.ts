import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { PaymentsSelectCard } from './select-card.component';
import { MockService } from '../../../utils/mock';
import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalService } from '../../../services/ux/modal.service';
import { SelectCardService } from './select-card.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('PaymentsSelectCard', () => {
  let comp: PaymentsSelectCard;
  let fixture: ComponentFixture<PaymentsSelectCard>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [PaymentsSelectCard],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        { provide: Client, useValue: MockService(Client) },
        { provide: ModalService, useValue: MockService(ModalService) },
        ChangeDetectorRef,
        DomSanitizer,
      ],
    }).overrideProvider(SelectCardService, {
      useValue: MockService(SelectCardService),
    });

    fixture = TestBed.createComponent(PaymentsSelectCard);
    comp = fixture.componentInstance;

    (comp as any).selectCardService.loadCards.and.returnValue(
      of([
        { id: 'gift_card', name: 'Gift Card', balance: 10 },
        { id: 'pm_1234', name: 'Test Card', balance: null },
      ])
    );

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should init and select gift card when card has enough balance', fakeAsync(() => {
    spyOn(comp.selected, 'next');

    (comp as any).selectCardService.loadCards.and.returnValue(
      of([
        { id: 'gift_card', name: 'Gift Card', balance: 10 },
        { id: 'pm_1234', name: 'Test Card', balance: null },
      ])
    );
    comp.paymentTotal = 10;

    (comp as any).loadCards();
    tick();

    expect(comp.paymentMethods.length).toBe(2);
    expect(comp.paymentMethodId).toBe('gift_card');
    expect((comp as any).selected.next).toHaveBeenCalledOnceWith('gift_card');
  }));

  it('should init and select bank card when gift card does not have enough balance', fakeAsync(() => {
    spyOn(comp.selected, 'next');

    (comp as any).selectCardService.loadCards.and.returnValue(
      of([
        { id: 'gift_card', name: 'Gift Card', balance: 9.99 },
        { id: 'pm_1234', name: 'Test Card', balance: null },
      ])
    );
    comp.paymentTotal = 10;

    (comp as any).loadCards();
    tick();

    expect(comp.paymentMethods.length).toBe(2);
    expect(comp.paymentMethodId).toBe('pm_1234');
    expect((comp as any).selected.next).toHaveBeenCalledOnceWith('pm_1234');
  }));

  it('should init and select already selected card', fakeAsync(() => {
    spyOn(comp.selected, 'next');
    (comp as any).paymentMethodId = 'pm_2345';
    (comp as any).selectCardService.loadCards.and.returnValue(
      of([
        { id: 'gift_card', name: 'Gift Card', balance: 9.99 },
        { id: 'pm_1234', name: 'Test Card 1', balance: null },
        { id: 'pm_2345', name: 'Test Card 2', balance: null },
      ])
    );
    comp.paymentTotal = 10;

    (comp as any).loadCards();
    tick();

    expect(comp.paymentMethods.length).toBe(3);
    expect(comp.paymentMethodId).toBe('pm_2345');
    expect((comp as any).selected.next).toHaveBeenCalledOnceWith('pm_2345');
  }));
});
