import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FeedNoticeService } from '../../services/feed-notice.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { Router } from '@angular/router';
import { BoostPartnersNoticeComponent } from './boost-partners-notice.component';

describe('BoostPartnersNoticeComponent', () => {
  let comp: BoostPartnersNoticeComponent;
  let fixture: ComponentFixture<BoostPartnersNoticeComponent>;
  let referralUrl: string = 'https://www.minds.com/register?referrer=mindsUser';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          BoostPartnersNoticeComponent,
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
            provide: Router,
            useValue: MockService(Router),
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(BoostPartnersNoticeComponent);
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
    comp.onPrimaryOptionClick();
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/info/blog/introducing-boost-partners-program-1477787849246904328',
    ]);
  });

  it('should navigate on secondary option click', () => {
    comp.onSecondaryOptionClick();
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/settings/account/boosted-content',
    ]);
  });

  it('should dismiss notice on dismiss function call', () => {
    comp.dismiss();
    expect((comp as any).feedNotice.dismiss).toHaveBeenCalledWith(
      'boost-partners'
    );
  });
});
