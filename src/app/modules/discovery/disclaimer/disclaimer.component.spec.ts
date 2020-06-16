import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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

describe('SidebarWidgetComponent', () => {
  let component: DiscoveryDisclaimerComponent;
  let fixture: ComponentFixture<DiscoveryDisclaimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscoveryDisclaimerComponent, SidebarWidgetComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Client, useValue: clientMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be visible by default', () => {
    const widget = fixture.debugElement.query(By.css('m-sidebarWidget'));
    expect(widget.properties.hidden).toBeFalsy();
  });

  it('should be hidden if dimissed', () => {
    sessionMock.user.dismissed_widgets = ['discovery-disclaimer-2020'];

    fixture = TestBed.createComponent(DiscoveryDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const widget = fixture.debugElement.query(By.css('m-sidebarWidget'));

    expect(widget.properties.hidden).toBeTruthy();
  });
});
