import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedNoticeComponent } from './feed-notice.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('FeedNoticeComponent', () => {
  let comp: FeedNoticeComponent;
  let fixture: ComponentFixture<FeedNoticeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [FeedNoticeComponent],
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
});
