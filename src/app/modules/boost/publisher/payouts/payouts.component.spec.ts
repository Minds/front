import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostPublisherPayoutsComponent } from './payouts.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { MockDirective } from '../../../../utils/mock';
import { Client } from '../../../../services/api/client';
import { DebugElement } from '@angular/core';

describe('BoostPublisherPayoutsComponent', () => {

  let comp: BoostPublisherPayoutsComponent;
  let fixture: ComponentFixture<BoostPublisherPayoutsComponent>;

  function getButton(): DebugElement {
    return fixture.debugElement.query(By.css('button'));
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        BoostPublisherPayoutsComponent
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock }
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(BoostPublisherPayoutsComponent);

    comp = fixture.componentInstance;

    clientMock.response = {};

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }

  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should a 'request payout' button", () => {
    fixture.detectChanges();

    const button = getButton();

    expect(button).not.toBeNull();
    expect(button.nativeElement.textContent).toContain('Request a payout');
  });

  it('should request a payout', () => {
    const button = getButton();

    const url = 'api/v1/payout';

    clientMock.response[url] = { status: 'success' };

    button.nativeElement.click();

    fixture.detectChanges();
    jasmine.clock().tick(10);

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toBe(url);
  });

});
