import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { SupermindPendingNoticeComponent } from './supermind-pending-notice.component';
import { Router } from '@angular/router';
import { FeedNoticeService } from '../../services/feed-notice.service';

describe('SupermindPendingNoticeComponent', () => {
  let comp: SupermindPendingNoticeComponent;
  let fixture: ComponentFixture<SupermindPendingNoticeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          SupermindPendingNoticeComponent,
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
            provide: Router,
            useValue: MockService(Router),
          },
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(SupermindPendingNoticeComponent);
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

  it('should navigate on primary option click', () => {
    comp.onPrimaryOptionClick(null);
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/supermind/inbox',
    ]);
  });

  it('should dismiss notice', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'supermind-pending'
    );
  });
});
