import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostPublisherComponent } from './publisher.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';

describe('BoostPublisherComponent', () => {

  let comp: BoostPublisherComponent;
  let fixture: ComponentFixture<BoostPublisherComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        BoostPublisherComponent
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoostPublisherComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();

  });

  it('should have a sidebar with two items: Earnings and Settings', () => {
    expect(fixture.debugElement.query(By.css('.m-page > .m-page--sidebar'))).not.toBeNull();

    const earnings = fixture.debugElement.query(By.css('.m-page--sidebar--navigation .m-page--sidebar--navigation--item:first-child'));
    expect(earnings).not.toBeNull();
    expect(earnings.nativeElement.children[0].textContent).toBe('history');
    expect(earnings.nativeElement.children[1].textContent).toBe('Earnings');

    const settings = fixture.debugElement.query(By.css('.m-page--sidebar--navigation .m-page--sidebar--navigation--item:last-child'));
    expect(settings).not.toBeNull();
    expect(settings.nativeElement.children[0].textContent).toBe('settings');
    expect(settings.nativeElement.children[1].textContent).toBe('Settings');
  });

  it('should have a router outlet', () => {
    expect(fixture.debugElement.query(By.css('.m-page > .m-page--main > router-outlet'))).not.toBeNull();
  });

});
