import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BoostChannelNoticeComponent } from './boost-channel-notice.component';
import { BoostModalV2LazyService } from '../../../boost/modal-v2/boost-modal-v2-lazy.service';
import { Session } from '../../../../services/session';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { Subject } from 'rxjs';

describe('BoostChannelNoticeComponent', () => {
  let comp: BoostChannelNoticeComponent;
  let fixture: ComponentFixture<BoostChannelNoticeComponent>;

  const mockUser: { guid: string } = {
    guid: '123',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [
          BoostChannelNoticeComponent,
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
            provide: BoostModalV2LazyService,
            useValue: MockService(BoostModalV2LazyService, {
              has: ['onComplete$'],
              props: {
                onComplete$: { get: () => new Subject<boolean>() },
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
    fixture = TestBed.createComponent(BoostChannelNoticeComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    (comp as any).feedNotice.dismiss.calls.reset();
    (comp as any).session.getLoggedInUser.calls.reset();
    (comp as any).session.getLoggedInUser.and.returnValue(mockUser);

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

  it('should open boost modal on primary option click', () => {
    comp.onPrimaryOptionClick();
    expect((comp as any).session.getLoggedInUser).toHaveBeenCalledTimes(1);
    expect((comp as any).boostModal.open).toHaveBeenCalledOnceWith(mockUser);
  });

  it('should open boost marketing page in a modal on secondary option click', () => {
    comp.onSecondaryOptionClick();
    expect(window.open).toHaveBeenCalledWith('/boost', '_blank');
  });

  it('should call to dismiss on dismiss click', () => {
    comp.onDismissClick();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledOnceWith(
      'boost-channel'
    );
  });

  it('should dismiss on boost completion', fakeAsync(() => {
    (comp as any).boostModal.onComplete$.next(true);
    tick();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledOnceWith(
      'boost-channel'
    );
  }));
});
