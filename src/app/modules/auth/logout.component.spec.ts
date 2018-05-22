import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutComponent } from './logout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { clientMock } from '../../../tests/client-mock.spec';
import { Client } from '../../services/api/client';
import { Router } from '@angular/router';

let routerMock = new function () {
  this.navigate = jasmine.createSpy('navigate');
};

xdescribe('LogoutComponent', () => {

  let comp: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [LogoutComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: Router, useValue: routerMock },
      ]
    })
      .compileComponents();
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should logout just after instantiating', () => {
    expect(clientMock.delete).toHaveBeenCalled();
    expect(clientMock.delete.calls.mostRecent().args[0]).toBe('api/v1/authenticate');
    expect(sessionMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalled();
    expect(routerMock.navigate.calls.mostRecent().args[0]).toEqual(['/login']);
  });

});
