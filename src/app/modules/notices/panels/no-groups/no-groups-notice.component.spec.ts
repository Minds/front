import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { NoGroupsNoticeComponent } from './no-groups-notice.component';

describe('NoGroupsNoticeComponent', () => {
  let comp: NoGroupsNoticeComponent;
  let fixture: ComponentFixture<NoGroupsNoticeComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          NoGroupsNoticeComponent,
          MockComponent({
            selector: 'm-feedNotice',
            inputs: ['icon'],
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
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(NoGroupsNoticeComponent);
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

  it('should dismiss notice on dismiss function call', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith('no-groups');
  });
});
