import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { InviteYourFriendsComponent } from './invite-your-friends-notice.component';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ReferralUrlService } from '../../../../common/services/referral-url.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { Router } from '@angular/router';

describe('InviteYourFriendsComponent', () => {
  let comp: InviteYourFriendsComponent;
  let fixture: ComponentFixture<InviteYourFriendsComponent>;
  let referralUrl: string = 'https://www.minds.com/register?referrer=mindsUser';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          InviteYourFriendsComponent,
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
          {
            provide: ReferralUrlService,
            useValue: MockService(ReferralUrlService),
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
          {
            provide: Router,
            useValue: MockService(Router),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(InviteYourFriendsComponent);
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

  it('should copy to clipboard and show success toast on primary option click', fakeAsync(() => {
    (comp as any).referralUrl.get.and.returnValue(referralUrl);
    spyOn(navigator.clipboard, 'writeText').and.callFake(
      async (data: string): Promise<void> => {
        return;
      }
    );
    comp.onPrimaryOptionClick();
    tick();

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(referralUrl);
    expect((comp as any).toast.success).toHaveBeenCalledWith(
      'Invite link copied to clipboard'
    );
  }));

  it('should show error if there is an error on primary option click', fakeAsync(() => {
    (comp as any).referralUrl.get.and.returnValue(null);

    comp.onPrimaryOptionClick();
    tick();

    expect((comp as any).toast.success).not.toHaveBeenCalledWith(
      'Invite link copied to clipboard'
    );
    expect((comp as any).toast.error).toHaveBeenCalledWith(
      'There was a problem getting your referral URL'
    );
  }));

  it('should navigate on secondary option click', () => {
    comp.onSecondaryOptionClick();
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/settings/other/referrals',
    ]);
  });

  it('should dismiss notice on dismiss function call', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'invite-your-friends'
    );
  });
});
