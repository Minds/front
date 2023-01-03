import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { BoostChannelNoticeComponent } from './boost-channel-notice.component';
import { BoostModalLazyService } from '../../../boost/modal/boost-modal-lazy.service';
import { Session } from '../../../../services/session';

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
            provide: BoostModalLazyService,
            useValue: MockService(BoostModalLazyService),
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

  it('should navigate on primary option click', () => {
    comp.onPrimaryOptionClick(null);
    expect((comp as any).session.getLoggedInUser).toHaveBeenCalledTimes(1);
    expect((comp as any).boostModal.open).toHaveBeenCalledOnceWith(mockUser);
  });

  it('should open boost marketing page in a modal on secondary option click', () => {
    comp.onSecondaryOptionClick(null);
    expect(window.open).toHaveBeenCalledWith('/boost', '_blank');
  });
});
