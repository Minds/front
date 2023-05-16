import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';
import { TopbarAlertComponent } from './topbar-alert.component';
import { TopbarAlertService } from './topbar-alert.service';
import { MockService } from '../../../utils/mock';
import { MarkdownModule } from 'ngx-markdown';

describe('TopbarAlertComponent', () => {
  let comp: TopbarAlertComponent;
  let fixture: ComponentFixture<TopbarAlertComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MarkdownModule.forRoot()],
        declarations: [TopbarAlertComponent],
        providers: [
          {
            provide: TopbarAlertService,
            useValue: MockService(TopbarAlertService, {
              has: ['shouldShow$', 'copyData$'],
              props: {
                shouldShow$: {
                  get: () => new ReplaySubject<boolean>(),
                },
                copyData$: {
                  get: () => new ReplaySubject<any>(),
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

  it('should call to dismiss the active notice', fakeAsync(() => {
    (comp as any).service.shouldShow$.next(true);
    (comp as any).dismiss();
    tick();

    expect((comp as any).service.dismiss).toHaveBeenCalled();
  }));

  it('should render message from service.copyData$', () => {
    (comp as any).service.shouldShow$.next(true);

    const message = 'Test message';
    (comp as any).service.copyData$.next({ attributes: { message } });
    fixture.detectChanges();
    const messageEl = fixture.debugElement.query(
      By.css('.m-topbarAlert__message')
    ).nativeElement;
    expect(messageEl.innerHTML).toContain(message);
  });
});
