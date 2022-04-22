import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedNoticeComponent } from './feed-notice.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedNoticeService } from '../services/feed-notice.service';
import { MockService } from '../../../utils/mock';

describe('FeedNoticeComponent', () => {
  let comp: FeedNoticeComponent;
  let fixture: ComponentFixture<FeedNoticeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [FeedNoticeComponent],
        providers: [
          {
            provide: FeedNoticeService,
            useValue: MockService(FeedNoticeService),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(FeedNoticeComponent);
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

  it('should check if is full width from service', () => {
    (comp as any).service.shouldBeFullWidth.and.returnValue(true);
    expect(comp.isFullWidth).toBeTruthy();
    (comp as any).service.shouldBeFullWidth.and.returnValue(false);
    expect(comp.isFullWidth).toBeFalsy();
  });
});
