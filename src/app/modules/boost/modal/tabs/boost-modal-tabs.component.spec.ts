import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../../../services/session';
import { MockComponent, MockService } from '../../../../utils/mock';
import { BoostModalService } from '../boost-modal.service';
import { BoostableEntity, BoostSubject, BoostTab } from '../boost-modal.types';
import { BoostModalTabsComponent } from './boost-modal-tabs.component';
import userMock from '../../../../mocks/responses/user.mock';

describe('BoostModalTabsComponent', () => {
  let comp: BoostModalTabsComponent;
  let fixture: ComponentFixture<BoostModalTabsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [
          BoostModalTabsComponent,
          MockComponent({
            selector: 'm-boostModal__amountInput',
          }),
          MockComponent({
            selector: 'm-boostModal__paymentMethodSelector',
          }),
        ],
        providers: [
          {
            provide: BoostModalService,
            useValue: MockService(BoostModalService, {
              has: ['activeTab$', 'entityType$', 'entity$'],
              props: {
                activeTab$: {
                  get: () => new BehaviorSubject<BoostTab>('cash'),
                },
                entityType$: {
                  get: () => new BehaviorSubject<BoostSubject>('post'),
                },
                entity$: {
                  get: () => new BehaviorSubject<BoostableEntity>({}),
                },
              },
            }),
          },
          {
            provide: Session,
            useValue: MockService(Session),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostModalTabsComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).service.activeTab$.next('cash');
    (comp as any).service.entityType$.next('post');
    (comp as any).service.entity$.next({});

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should be instantiated', () => {
    expect(comp).toBeTruthy();
  });

  it('should change tab', () => {
    expect(comp.activeTab$.getValue()).toBe('cash');
    comp.nextTab('tokens');
    expect(comp.activeTab$.getValue()).toBe('tokens');
  });

  it('should get logged in user from service', () => {
    const user = userMock;
    (comp as any).session.getLoggedInUser.and.returnValue(user);
    expect(comp.getLoggedInUser()).toBe(user);
  });
});
