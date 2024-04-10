import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { ConfigsService } from '../../services/configs.service';
import { MockService } from '../../../utils/mock';
import { SidebarWidgetComponent } from './sidebar-widget.component';
import { clientMock } from '../../../../tests/client-mock.spec';
import { Client } from '../../api/client.service';

describe('SidebarWidgetComponent', () => {
  let component: SidebarWidgetComponent;
  let fixture: ComponentFixture<SidebarWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarWidgetComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        { provide: Client, useValue: clientMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    sessionMock.user.dismissed_widgets = ['test-widget-id'];

    fixture = TestBed.createComponent(SidebarWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be hidden if widgetId set', () => {
    component.dismissibleId = 'test-widget-id';
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.hidden).toBeTruthy();
  });

  it('should dismiss on click', () => {
    component.dismissibleId = 'my-new-widget-id';
    expect(component.hidden).toBeFalsy();

    component.onDismissClick(new MouseEvent('click'));

    expect(clientMock.put.calls.mostRecent().args[0]).toEqual(
      'api/v3/dismissible-widgets/my-new-widget-id'
    );
    expect(component.hidden).toBeTruthy();
  });
});
