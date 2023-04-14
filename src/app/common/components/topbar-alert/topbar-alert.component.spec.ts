import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { TopbarAlertComponent } from './topbar-alert.component';
import { AlertKey, TopbarAlertService } from './topbar-alert.service';
import { MockService } from '../../../utils/mock';

describe('TopbarAlertComponent', () => {
  let comp: TopbarAlertComponent;
  let fixture: ComponentFixture<TopbarAlertComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TopbarAlertComponent],
        providers: [
          {
            provide: TopbarAlertService,
            useValue: MockService(TopbarAlertService, {
              has: ['activeAlert$'],
              props: {
                activeAlert$: {
                  get: () => new BehaviorSubject<AlertKey>('referral'),
                },
              },
            }),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(TopbarAlertComponent);
    comp = fixture.componentInstance;

    (comp as any).service.activeAlert$.next('referral');

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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should get active alert from service', (done: DoneFn) => {
    const activeAlert: string = 'test';
    (comp as any).service.activeAlert$.next(activeAlert);
    (comp as any).activeAlert$.subscribe((_activeAlert: string) => {
      expect(_activeAlert).toBe(activeAlert);
      done();
    });
  });

  it('should call to dismiss the active notice', fakeAsync(() => {
    const activeAlert: string = 'test';
    (comp as any).service.activeAlert$.next(activeAlert);
    (comp as any).dismiss();
    tick();

    expect((comp as any).service.dismiss).toHaveBeenCalledWith(activeAlert);
  }));
});
