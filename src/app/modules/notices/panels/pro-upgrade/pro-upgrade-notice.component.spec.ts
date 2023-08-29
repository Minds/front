import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ProUpgradeNoticeComponent } from './pro-upgrade-notice.component';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { ModalService } from '../../../../services/ux/modal.service';
import { WirePaymentHandlersService } from '../../../wire/wire-payment-handlers.service';
import { PlusUpgradeNoticeExperimentService } from '../../../experiments/sub-services/plus-upgrade-notice-experiment.service';
import { WireCreatorComponent } from '../../../wire/v2/creator/wire-creator.component';

describe('ProUpgradeNoticeComponent', () => {
  let comp: ProUpgradeNoticeComponent;
  let fixture: ComponentFixture<ProUpgradeNoticeComponent>;

  const mockHandler: { guid: string } = { guid: '123' };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          ProUpgradeNoticeComponent,
          MockComponent({
            selector: 'm-feedNotice',
            inputs: ['icon', 'dismissible'],
            outputs: ['dismissClick'],
          }),
          MockComponent({
            selector: 'm-button',
            inputs: ['color', 'solid', 'size'],
            outputs: ['onAction'],
          }),
        ],
        providers: [
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService),
          },
          {
            provide: ModalService,
            useValue: MockService(ModalService),
          },
          {
            provide: WirePaymentHandlersService,
            useValue: MockService(WirePaymentHandlersService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(ProUpgradeNoticeComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).feedNotice.dismiss.calls.reset();
    (comp as any).modalService.present.calls.reset();
    (comp as any).wirePaymentHandlers.get.calls.reset();

    (comp as any).wirePaymentHandlers.get.and.returnValue(
      Promise.resolve(mockHandler)
    );

    spyOn(window, 'open');

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should wire modal on primary option click', fakeAsync(() => {
    comp.onPrimaryOptionClick();
    tick();

    expect((comp as any).modalService.present).toHaveBeenCalledWith(
      WireCreatorComponent,
      jasmine.objectContaining({
        size: 'lg',
        data: {
          entity: mockHandler,
          default: {
            type: 'money',
            upgradeType: 'pro',
            upgradeInterval: 'monthly',
          },
          onComplete: jasmine.any(Function),
        },
      })
    );
  }));

  it('should open boost marketing page in a new tab on secondary option click', () => {
    comp.onSecondaryOptionClick();
    expect(window.open).toHaveBeenCalledWith('/pro', '_blank');
  });

  it('should call to dismiss on dismiss click', () => {
    comp.onDismissClick();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledOnceWith(
      'pro-upgrade'
    );
  });
});
