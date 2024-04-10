import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { By } from '@angular/platform-browser';
import { SidebarWidgetComponent } from '../../../common/components/sidebar-widget/sidebar-widget.component';
import { MockService } from '../../../utils/mock';
import { clientMock } from '../../../../tests/client-mock.spec';
import { Client } from '../../../services/api';
import { ConfigsService } from '../../../common/services/configs.service';
import { LanguageSidebarPromptComponent } from './sidebar-prompt.component';
import { CookieService } from '../../../common/services/cookie.service';
import { LanguageService } from '../language.service';
import {
  CookieOptionsProvider,
  COOKIE_OPTIONS,
  CookieModule,
} from '@mindsorg/ngx-universal';
import { ApiService } from '../../../common/api/api.service';
import { ButtonComponent } from '../../../common/components/button/button.component';

describe('LanguageSidebarPromptComponent', () => {
  let component: LanguageSidebarPromptComponent;
  let fixture: ComponentFixture<LanguageSidebarPromptComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        LanguageSidebarPromptComponent,
        SidebarWidgetComponent,
        ButtonComponent,
      ],
      imports: [RouterTestingModule, CookieModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Client, useValue: clientMock },
        CookieService,
        { provide: COOKIE_OPTIONS, useValue: CookieOptionsProvider },
        LanguageService,
        {
          provide: ApiService,
          useValue: MockService(ApiService, {}),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSidebarPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should be visible by default', () => {
    const widget = fixture.debugElement.query(By.css('m-sidebarWidget'));
    expect(widget.properties.hidden).toBeFalsy();
  });

  xit('should be hidden if dimissed', () => {
    sessionMock.user.dismissed_widgets = ['language-sidebar-2020'];

    fixture = TestBed.createComponent(LanguageSidebarPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const widget = fixture.debugElement.query(By.css('m-sidebarWidget'));

    expect(widget.properties.hidden).toBeTruthy();
  });
});
