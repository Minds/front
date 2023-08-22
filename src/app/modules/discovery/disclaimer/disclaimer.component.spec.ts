import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../services/session';
import { DiscoveryDisclaimerComponent } from './disclaimer.component';
import { By } from '@angular/platform-browser';
import { SidebarWidgetComponent } from '../../../common/components/sidebar-widget/sidebar-widget.component';
import { MockService } from '../../../utils/mock';
import { clientMock } from '../../../../tests/client-mock.spec';
import { Client } from '../../../services/api';
import { ConfigsService } from '../../../common/services/configs.service';
import userMock from '../../../mocks/responses/user.mock';
import { BehaviorSubject } from 'rxjs';

describe('DiscoveryDisclaimerComponent', () => {
  let comp: DiscoveryDisclaimerComponent;
  let fixture: ComponentFixture<DiscoveryDisclaimerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DiscoveryDisclaimerComponent, SidebarWidgetComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: ConfigsService, useValue: MockService(ConfigsService) },
          { provide: Client, useValue: clientMock },
        ],
      })
        .overrideProvider(Session, {
          useValue: MockService(Session, {
            has: ['loggedinEmitter'],
            props: {
              loggedinEmitter: {
                get: () => new BehaviorSubject<boolean>(true),
              },
            },
          }),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);

    comp = fixture.componentInstance;

    (comp as any).session.isLoggedIn.and.returnValue(true);
    (comp as any).session.getLoggedInUser.and.returnValue({
      ...userMock,
      dismissed_widgets: [],
    });
    (comp as any).dismissibleId = null;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('dismissed state', () => {
    beforeEach(done => {
      fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);

      comp = fixture.componentInstance;

      (comp as any).session.isLoggedIn.and.returnValue(true);
      (comp as any).session.getLoggedInUser.and.returnValue({
        ...userMock,
        dismissed_widgets: ['discovery-disclaimer-2020'],
      });
      (comp as any).dismissibleId = 'discovery-disclaimer-2020';

      fixture.detectChanges();

      if (fixture.isStable()) {
        done();
      } else {
        fixture.whenStable().then(() => {
          done();
        });
      }
    });

    it('should be hidden if dismissed', () => {
      const widget = fixture.debugElement.query(By.css('m-sidebarWidget'));
      expect(widget.properties.hidden).toBeTruthy();
    });
  });

  describe('not logged in state', () => {
    beforeEach(done => {
      fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);

      comp = fixture.componentInstance;

      (comp as any).session.isLoggedIn.and.returnValue(false);
      (comp as any).session.getLoggedInUser.and.returnValue(null);
      (comp as any).dismissibleId = null;
      (comp as any).session.loggedinEmitter.next(false);

      fixture.detectChanges();

      if (fixture.isStable()) {
        done();
      } else {
        fixture.whenStable().then(() => {
          done();
        });
      }
    });

    it('should NOT be hidden if not logged in', () => {
      const widget = fixture.debugElement.query(By.css('m-sidebarWidget'));
      expect(widget.properties.hidden).toBeFalse();
    });
  });

  describe('not dismissed state', () => {
    beforeEach(done => {
      fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);

      comp = fixture.componentInstance;

      (comp as any).session.isLoggedIn.and.returnValue(true);
      (comp as any).session.getLoggedInUser.and.returnValue({
        dismissed_widgets: ['some-other-disclaimer'],
      });
      (comp as any).session.loggedinEmitter.next(true);
      (comp as any).dismissibleId = 'discovery-disclaimer-2020';

      fixture.detectChanges();

      if (fixture.isStable()) {
        done();
      } else {
        fixture.whenStable().then(() => {
          done();
        });
      }
    });

    it('should be visible by default', () => {
      const widget = fixture.debugElement.query(By.css('m-sidebarWidget'));
      expect(widget.properties.hidden).toBeFalsy();
    });

    it('should have a link to content policy page in anchor tag for speak your mind', () => {
      const anchorTag = fixture.debugElement.query(
        By.css(
          'm-sidebarWidget [data-ref="discovery-disclaimer-speak-your-mind"]'
        )
      );
      expect(anchorTag.nativeElement.href).toBe(
        'https://www.minds.com/content-policy'
      );
    });

    it('should have a link to boost page in anchor tag for expand your audience', () => {
      const anchorTag = fixture.debugElement.query(
        By.css(
          'm-sidebarWidget [data-ref="discovery-disclaimer-expand-your-audience"]'
        )
      );
      expect(anchorTag.nativeElement.href).toBe('https://www.minds.com/boost');
    });

    it('should have a link to chat in anchor tag for chat privately with friends', () => {
      const anchorTag = fixture.debugElement.query(
        By.css(
          'm-sidebarWidget [data-ref="discovery-disclaimer-chat-with-friends"]'
        )
      );
      expect(anchorTag.nativeElement.href).toBe('https://chat.minds.com/');
    });

    it('should have a link to change minds in anchor tag for engage with diverse opinions', () => {
      const anchorTag = fixture.debugElement.query(
        By.css(
          'm-sidebarWidget [data-ref="discovery-disclaimer-engage-diverse-opinions"]'
        )
      );
      expect(anchorTag.nativeElement.href).toBe('https://change.minds.com/');
    });

    it('should have a link to upgrades page in anchor tag for make money', () => {
      const anchorTag = fixture.debugElement.query(
        By.css('m-sidebarWidget [data-ref="discovery-disclaimer-make-money"]')
      );
      expect(anchorTag.nativeElement.href).toBe(
        'https://www.minds.com/upgrades'
      );
    });

    it('should have a link to token page in anchor tag for earn crypto rewards', () => {
      const anchorTag = fixture.debugElement.query(
        By.css(
          'm-sidebarWidget [data-ref="discovery-disclaimer-earn-crypto-rewards"]'
        )
      );
      expect(anchorTag.nativeElement.href).toBe('https://www.minds.com/token');
    });

    it('should have a link to developer docs page in anchor tag for open source and decentralized', () => {
      const anchorTag = fixture.debugElement.query(
        By.css(
          'm-sidebarWidget [data-ref="discovery-disclaimer-open-source-decentralized"]'
        )
      );
      expect(anchorTag.nativeElement.href).toBe(
        'https://developers.minds.com/'
      );
    });

    it('should NOT set a top border when showBorderTop is false', () => {
      expect(
        fixture.debugElement.query(
          By.css('m-sidebarWidget .m-sidebarWidget__border--primary')
        )
      ).toBeTruthy();
    });
  });
});
