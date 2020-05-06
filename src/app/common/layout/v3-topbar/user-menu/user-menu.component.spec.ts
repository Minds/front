import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule as NgCommonModule } from '@angular/common';
import { UserMenuV3Component } from './user-menu.component';
import { FormsModule } from '@angular/forms';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { ThemeService } from '../../../services/theme.service';
import { MockComponent } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { IfFeatureDirective } from '../../../directives/if-feature.directive';
import { FeaturesService } from '../../../../services/features.service';
import { featuresServiceMock } from '../../../../../tests/features-service-mock.spec';
import { themeServiceMock } from '../../../../mocks/common/services/theme.service-mock.spec';
import { By } from '@angular/platform-browser';

describe('UserMenuV3Component', () => {
  let comp: UserMenuV3Component;
  let fixture: ComponentFixture<UserMenuV3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'minds-avatar',
          inputs: ['object', 'src', 'editMode', 'waitForDoneSignal'],
        }),
        IfFeatureDirective,
        UserMenuV3Component,
      ],
      imports: [FormsModule, RouterTestingModule, NgCommonModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: FeaturesService, useValue: featuresServiceMock },
        {
          provide: ThemeService,
          useValue: themeServiceMock,
        },
      ],
    }).compileComponents(); // compile template and css
  }));

  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    featuresServiceMock.mock('dark-mode', false);
    featuresServiceMock.mock('helpdesk', true);

    fixture = TestBed.createComponent(UserMenuV3Component);

    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('Upgrade should only be visible for non pro users', () => {
    comp.toggleMenu();

    expect(
      fixture.debugElement.query(By.css('.m-userMenuDropdownItem__upgrade'))
    ).not.toBeNull();

    sessionMock.user.pro = true;

    fixture.detectChanges();
    comp.detectChanges();
    jasmine.clock().tick(1000);

    expect(
      fixture.debugElement.query(By.css('.m-userMenuDropdownItem__upgrade'))
    ).toBeNull();
  });

  it('should have a "buy tokens" option that redirects to /token', () => {
    comp.toggleMenu();
    expect(
      fixture.debugElement.query(By.css('.m-userMenuDropdownItem__buyTokens'))
    ).not.toBeNull();

    const link = fixture.debugElement.query(
      By.css('.m-userMenuDropdownItem__buyTokens a')
    );
    expect(link).not.toBeNull();

    expect(link.nativeElement.getAttribute('routerLink')).toEqual('/token');
  });
});
