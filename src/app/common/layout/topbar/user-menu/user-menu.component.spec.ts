import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';

import { CommonModule as NgCommonModule } from '@angular/common';
import { UserMenuComponent } from './user-menu.component';
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
import { Component, DebugElement, Input } from '@angular/core';

describe('UserMenuComponent', () => {
  let comp: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;

  function getDropdown(): DebugElement {
    return fixture.debugElement.query(By.css('.m-dropdownMenu'));
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockComponent({
            selector: 'minds-avatar',
            inputs: ['object', 'src', 'editMode', 'waitForDoneSignal'],
          }),
          MockComponent({
            selector: 'm-dropdownMenu',
            inputs: ['menu', 'anchorPosition'],
          }),
          MockComponent({
            selector: 'm-dropdownMenu__item',
            inputs: ['link', 'externalLink'],
          }),
          IfFeatureDirective,
          UserMenuComponent,
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
    })
  );

  beforeEach(() => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(UserMenuComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  xit('Upgrade should be visible for non pro users', fakeAsync(() => {
    sessionMock.user.pro = false;

    const dropdown = getDropdown();
    dropdown.nativeElement.click();
    tick();

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-userMenuDropdownItem__upgrade'))
    ).not.toBeNull();
  }));

  xit('Upgrade should not be visible for pro users', fakeAsync(() => {
    sessionMock.user.pro = true;

    const dropdown = getDropdown();
    dropdown.nativeElement.click();
    tick();

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-userMenuDropdownItem__upgrade'))
    ).toBeNull();
  }));
});
