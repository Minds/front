import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { DiscoveryDisclaimerComponent } from './disclaimer.component';
import { By } from '@angular/platform-browser';
import { SidebarWidgetComponent } from '../../../common/components/sidebar-widget/sidebar-widget.component';
import { MockService } from '../../../utils/mock';
import { clientMock } from '../../../../tests/client-mock.spec';
import { Client } from '../../../services/api';
import { ConfigsService } from '../../../common/services/configs.service';

describe('DiscoveryDisclaimerComponent', () => {
  let component: DiscoveryDisclaimerComponent;
  let fixture: ComponentFixture<DiscoveryDisclaimerComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [DiscoveryDisclaimerComponent, SidebarWidgetComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: Session, useValue: sessionMock },
          { provide: ConfigsService, useValue: MockService(ConfigsService) },
          { provide: Client, useValue: clientMock },
        ],
      }).compileComponents();
    })
  );

  it('should create', () => {
    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should be visible by default', () => {
    sessionMock.user.dismissed_widgets = ['some-other-disclaimer'];

    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    fixture.detectChanges();

    const widget = fixture.debugElement.query(By.css('m-sidebarWidget'));
    expect(widget.properties.hidden).toBeFalsy();
  });

  it('should be hidden if dimissed', () => {
    sessionMock.user.dismissed_widgets = ['discovery-disclaimer-2020'];

    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    fixture.detectChanges();

    const widget = fixture.debugElement.query(By.css('m-sidebarWidget'));
    expect(widget.properties.hidden).toBeTruthy();
  });

  it('should have a link to content policy page in anchor tag for speak your mind', () => {
    sessionMock.user.dismissed_widgets = ['some-other-disclaimer'];

    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    fixture.detectChanges();

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
    sessionMock.user.dismissed_widgets = ['some-other-disclaimer'];

    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    fixture.detectChanges();

    const anchorTag = fixture.debugElement.query(
      By.css(
        'm-sidebarWidget [data-ref="discovery-disclaimer-expand-your-audience"]'
      )
    );
    expect(anchorTag.nativeElement.href).toBe('https://www.minds.com/boost');
  });

  it('should have a link to chat in anchor tag for chat privately with friends', () => {
    sessionMock.user.dismissed_widgets = ['some-other-disclaimer'];

    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    fixture.detectChanges();

    const anchorTag = fixture.debugElement.query(
      By.css(
        'm-sidebarWidget [data-ref="discovery-disclaimer-chat-with-friends"]'
      )
    );
    expect(anchorTag.nativeElement.href).toBe('https://chat.minds.com/');
  });

  it('should have a link to change minds in anchor tag for engage with diverse opinions', () => {
    sessionMock.user.dismissed_widgets = ['some-other-disclaimer'];

    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    fixture.detectChanges();

    const anchorTag = fixture.debugElement.query(
      By.css(
        'm-sidebarWidget [data-ref="discovery-disclaimer-engage-diverse-opinions"]'
      )
    );
    expect(anchorTag.nativeElement.href).toBe('https://change.minds.com/');
  });

  it('should have a link to upgrades page in anchor tag for make money', () => {
    sessionMock.user.dismissed_widgets = ['some-other-disclaimer'];

    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    fixture.detectChanges();

    const anchorTag = fixture.debugElement.query(
      By.css('m-sidebarWidget [data-ref="discovery-disclaimer-make-money"]')
    );
    expect(anchorTag.nativeElement.href).toBe('https://www.minds.com/upgrades');
  });

  it('should have a link to token page in anchor tag for earn crypto rewards', () => {
    sessionMock.user.dismissed_widgets = ['some-other-disclaimer'];

    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    fixture.detectChanges();

    const anchorTag = fixture.debugElement.query(
      By.css(
        'm-sidebarWidget [data-ref="discovery-disclaimer-earn-crypto-rewards"]'
      )
    );
    expect(anchorTag.nativeElement.href).toBe('https://www.minds.com/token');
  });

  it('should have a link to developer docs page in anchor tag for open source and decentralized', () => {
    sessionMock.user.dismissed_widgets = ['some-other-disclaimer'];

    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    fixture.detectChanges();

    const anchorTag = fixture.debugElement.query(
      By.css(
        'm-sidebarWidget [data-ref="discovery-disclaimer-open-source-decentralized"]'
      )
    );
    expect(anchorTag.nativeElement.href).toBe('https://developers.minds.com/');
  });
});
