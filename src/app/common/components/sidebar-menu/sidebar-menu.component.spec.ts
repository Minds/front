import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { SidebarMenuComponent } from './sidebar-menu.component';
import sidebarMenu from '../../../modules/analytics/v2/sidebar-menu.default';
import { ConfigsService } from '../../services/configs.service';
import { MockService } from '../../../utils/mock';

describe('SidebarMenuComponent', () => {
  let component: SidebarMenuComponent;
  let fixture: ComponentFixture<SidebarMenuComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SidebarMenuComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide: Session, useValue: sessionMock },
          { provide: ConfigsService, useValue: MockService(ConfigsService) },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarMenuComponent);
    component = fixture.componentInstance;
    component.menu = sidebarMenu;
    // component.user = sessionMock.user;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
