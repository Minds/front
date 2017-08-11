///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { WireLockScreenComponent } from '../lock-screen/wire-lock-screen.component';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../tests/client-mock.spec';

describe('WireLockScreenComponent', () => {

  let comp: WireLockScreenComponent;
  let fixture: ComponentFixture<WireLockScreenComponent>;
  const defaultActivity = {
    ownerObj: {
      username: 'minds'
    },
    wire_threshold: {
      type: 'points',
      min: '10'
    }
  };

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ WireLockScreenComponent ], // declare the test component
      imports: [],
      providers: [
        { provide: Client, useValue: clientMock }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(WireLockScreenComponent);

    comp = fixture.componentInstance; // LoginForm test instance

    comp.entity = defaultActivity;

    clientMock.response = { 'status': 'success' };

    spyOn(comp.update, 'next').and.callThrough();
  });

  it('should have svg bolt icon', () => {
    expect(fixture.debugElement.query(By.css('svg'))).toBeDefined();
  });
  it('should show monthly threshold', fakeAsync(() => {
    fixture.detectChanges();
    const monthlyMin: DebugElement = fixture.debugElement.query(By.css('h2'));

    expect(monthlyMin.nativeElement.textContent).toContain('10/month');
  }));
  it('should have message', () => {
    fixture.detectChanges();
    const message: DebugElement = fixture.debugElement.query(By.css('.m-wire--lock-screen--message'));
    expect(message).toBeDefined();
    expect(message.nativeElement.textContent).toContain('This post can only be seen by supporters who wire over $ 10/month to @minds');
  });
  it('shouldn\'t update the entity if wire/threshold doesn\'t return an activity', () => {
    fixture.detectChanges();
    expect(comp.update.next).not.toHaveBeenCalled();
  });
  it('should update the entity if wire/threshold returns an activity', fakeAsync(() => {
    clientMock.response = { 'status': 'success', 'activity': defaultActivity };

    fixture.detectChanges();
    tick();

    expect(comp.update.next).toHaveBeenCalled();
    expect(comp.update.next[ 'calls' ].mostRecent().args[ 0 ]).toBe(defaultActivity);
  }));
});
