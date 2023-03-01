import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { Observable, Subject } from 'rxjs';
import { BoostLatestPostNoticeComponent } from './boost-latest-post-notice.component';
import { Router } from '@angular/router';
import { BoostLatestPostNoticeService } from './boost-latest-post-notice.service';
import { ActivityEntity } from '../../../newsfeed/activity/activity.service';

describe('BoostLatestPostNoticeComponent', () => {
  let comp: BoostLatestPostNoticeComponent;
  let fixture: ComponentFixture<BoostLatestPostNoticeComponent>;

  const mockUser: { guid: string } = {
    guid: '123',
  };

  const latestPost$ = new Observable<ActivityEntity>();

  const BoostLatestPostNoticeServiceMock: any = MockService(
    BoostLatestPostNoticeService,
    {
      has: ['latestPost$'],
      props: {
        latestPost$: { get: () => latestPost$ },
      },
    }
  );

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          BoostLatestPostNoticeComponent,
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
            provide: BoostLatestPostNoticeService,
            useValue: BoostLatestPostNoticeServiceMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostLatestPostNoticeComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).feedNotice.dismiss.calls.reset();
    // (comp as any).session.getLoggedInUser.calls.reset();
    // (comp as any).session.getLoggedInUser.and.returnValue(mockUser);

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

  it('should call to dismiss on dismiss click', () => {
    comp.onDismissClick();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledOnceWith(
      'boost-latest-post'
    );
  });
});
