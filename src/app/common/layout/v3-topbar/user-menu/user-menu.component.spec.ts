import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonModule as NgCommonModule } from '@angular/common';
import { UserMenuV3Component } from './user-menu.component';
import { FormsModule } from '@angular/forms';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { ThemeService } from '../../../services/theme.service';
import { MockComponent, MockService } from '../../../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { IfFeatureDirective } from '../../../directives/if-feature.directive';
import { FeaturesService } from '../../../../services/features.service';
import { featuresServiceMock } from '../../../../../tests/features-service-mock.spec';
import { themeServiceMock } from '../../../../mocks/common/services/theme.service-mock.spec';
import { By } from '@angular/platform-browser';
import { UserMenuService } from './user-menu.service';
import { userMenuServiceMock } from './user-menu.service-mock.spec';

describe('UserMenuV3Component', () => {
  let comp: UserMenuV3Component;
  let fixture: ComponentFixture<UserMenuV3Component>;

  beforeEach(
    waitForAsync(() => {
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
          { provide: UserMenuService, useValue: userMenuServiceMock },
        ],
      }).compileComponents(); // compile template and css
    })
  );

  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    featuresServiceMock.mock('settings-referrals', true);
    featuresServiceMock.mock('helpdesk-2021', false);

    fixture = TestBed.createComponent(UserMenuV3Component);

    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('Upgrade should be visible for non pro users', () => {
    sessionMock.user.pro = false;

    comp.toggleMenu();

    fixture.detectChanges();
    expect(
      fixture.debugElement.query(By.css('.m-userMenuDropdownItem__upgrade'))
    ).not.toBeNull();

    // comp.detectChanges();
    // jasmine.clock().tick(1000);

    // expect(
    //   fixture.debugElement.query(By.css('.m-userMenuDropdownItem__upgrade'))
    // ).toBeNull();
  });

  it('Upgrade should not be visible for pro users', () => {
    sessionMock.user.pro = true;

    comp.toggleMenu();
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-userMenuDropdownItem__upgrade'))
    ).toBeNull();

    // fixture.detectChanges();
    // comp.detectChanges();
    // jasmine.clock().tick(1000);

    // expect(
    //   fixture.debugElement.query(By.css('.m-userMenuDropdownItem__upgrade'))
    // ).toBeNull();
  });
});
