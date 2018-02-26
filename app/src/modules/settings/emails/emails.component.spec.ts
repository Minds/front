import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { SettingsEmailsComponent } from './emails.component';

xdescribe('SettingsEmailsComponent', () => {

  let comp: SettingsEmailsComponent;
  let fixture: ComponentFixture<SettingsEmailsComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  function getSaveButton(): DebugElement {
    return fixture.debugElement.query(By.css('.m-settings--emails--save'));
  }

  function getListElement(campaign: 'when' | 'with' | 'global', i: number): DebugElement {
    return fixture.debugElement.query(By.css(`.m-settings--emails--${campaign}-campaign ul.m-settings--emails-campaigns li:nth-child(${i})`));
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MaterialMock, SettingsEmailsComponent], // declare the test component
      imports: [RouterTestingModule, FormsModule, ReactiveFormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(SettingsEmailsComponent);

    comp = fixture.componentInstance; // SettingsEmailsComponent test instance

    clientMock.response = {};

    clientMock.response['api/v1/settings'] = {
      'status': 'success',
      'notifications': [
        {
          'campaign': 'when',
          'topic': 'boost_completed',
          'value': false
        },
        {
          'campaign': 'when',
          'topic': 'wire_received',
          'value': false
        }
      ]
    };

    fixture.detectChanges();

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

  it('load function should update notifications', fakeAsync(()=>{
    clientMock.response['api/v1/settings'] = {
      'status': 'success',
      'notifications': [
        {
          'campaign': 'when',
          'topic': 'boost_completed',
          'value': true
        }
      ]
    };
    expect(comp.notifications.when.boost_completed).toBeFalsy();
    comp.load();

    tick();
    fixture.detectChanges();

    expect(clientMock.get.calls.mostRecent().args[0]).toBe('api/v1/settings');
    expect(comp.notifications.when.boost_completed).toBeTruthy();
  }));

  it('should have save button', () => {
    expect(getSaveButton()).not.toBeNull();
  });
  it('save button should be disabled', () => {
    expect(getSaveButton().nativeElement.disabled).toBeTruthy();
  });
  it('save button should be enabled if something changed', () => {
    comp.changed = true;
    fixture.detectChanges();
    expect(getSaveButton().nativeElement.disabled).toBeFalsy();
  });
  it('save button should call save()', () => {
    comp.changed = true;
    fixture.detectChanges();

    spyOn(comp, 'save').and.callThrough();

    getSaveButton().nativeElement.click();
    fixture.detectChanges();

    expect(comp.save).toHaveBeenCalled();
  });

  it('should have a spinner', () => {
    expect(fixture.debugElement.query(By.css('.mdl-spinner'))).not.toBeNull();
  });


  it('should have a \'Email me when...\' label', () => {
    const label: DebugElement = fixture.debugElement.query(By.css('.m-settings--emails--when-campaign h4'));
    expect(label).not.toBeNull();
    expect(label.nativeElement.textContent).toContain('Email me when');
  });
  it('should have a list of campaigns', () => {
    const list: DebugElement = fixture.debugElement.query(By.css('.m-settings--emails--when-campaign ul.m-settings--emails-campaigns'));
    expect(list).not.toBeNull();
    expect(list.nativeElement.children.length).toBe(3);
  });
  it('should have a \'I have unread notifications\' item', () => {
    const element: DebugElement = getListElement('when', 1);
    expect(element).not.toBeNull();
  });
  it('\'I have unread notifications\' should have a checkbox and a label', () => {
    const element: DebugElement = getListElement('when', 1);

    expect(element.nativeElement.children[0].tagName).toBe('INPUT');
    expect(element.nativeElement.children[0].type).toBe('checkbox');

    expect(element.nativeElement.children[1].tagName).toBe('LABEL');
    expect(element.nativeElement.children[1].textContent).toContain('I have unread notifications');
  });

  it('should have a \'I receive a wire\' item', () => {
    const element: DebugElement = getListElement('when', 2);
    expect(element).not.toBeNull();

    expect(element.nativeElement.children[1].textContent).toContain('I receive a wire');
  });
  it('should have a \'My boost has been completed\' item', () => {
    const element: DebugElement = getListElement('when', 3);
    expect(element).not.toBeNull();

    expect(element.nativeElement.children[1].textContent).toContain('My boost has been completed');
  });

  it('should have a \'Email me with...\' label', () => {
    const label: DebugElement = fixture.debugElement.query(By.css('.m-settings--emails--with-campaign h4'));
    expect(label).not.toBeNull();
    expect(label.nativeElement.textContent).toContain('Email me with');
  });
  it('should have a \'Top posts from my network\' item', () => {
    const element: DebugElement = getListElement('with', 1);
    expect(element).not.toBeNull();

    expect(element.nativeElement.children[1].textContent).toContain('Top posts from my network');
  });
  it('\'Top posts from my network\' should also have a dropdown with \'Periodically\', \'Daily\' and \'Weekly\' ', () => {
    const element: DebugElement = getListElement('with', 1);
    expect(element).not.toBeNull();

    expect(element.nativeElement.children[3].tagName).toBe('SELECT');
    expect(element.nativeElement.children[3].children[0].textContent).toBe('Periodically');
    expect(element.nativeElement.children[3].children[1].textContent).toBe('Daily');
    expect(element.nativeElement.children[3].children[2].textContent).toBe('Weekly');
  });
  it('should have a \'Tips on how to improve my channel\' item', () => {
    const element: DebugElement = getListElement('with', 2);
    expect(element).not.toBeNull();

    expect(element.nativeElement.children[1].textContent).toContain('Tips on how to improve my channel');
  });
  it('should have a \'Things I\'ve missed since my last login\' item', () => {
    const element: DebugElement = getListElement('with', 3);
    expect(element).not.toBeNull();

    expect(element.nativeElement.children[1].textContent).toContain('Things I\'ve missed since my last login');
  });
  it('should have a \'New channels to subscribe to\' item', () => {
    const element: DebugElement = getListElement('with', 4);
    expect(element).not.toBeNull();

    expect(element.nativeElement.children[1].textContent).toContain('New channels to subscribe to');
  });

  it('should have a \'Keep me updated with...\' label', () => {
    const label: DebugElement = fixture.debugElement.query(By.css('.m-settings--emails--global-campaign h4'));
    expect(label).not.toBeNull();
    expect(label.nativeElement.textContent).toContain('Keep me updated with');
  });
  it('should have a \'News about new Minds products and features\' item', () => {
    const element: DebugElement = getListElement('global', 1);
    expect(element).not.toBeNull();

    expect(element.nativeElement.children[1].textContent).toContain('News about new Minds products and features');
  });
  it('should have a \'Tips on how to use Minds\' item', () => {
    const element: DebugElement = getListElement('global', 2);
    expect(element).not.toBeNull();

    expect(element.nativeElement.children[1].textContent).toContain('Tips on how to use Minds');
  });
  it('should have a \'Exclusive promotions\' item', () => {
    const element: DebugElement = getListElement('global', 3);
    expect(element).not.toBeNull();

    expect(element.nativeElement.children[1].textContent).toContain('Exclusive promotions');
  });

  it('clicking on an element\'s checkbox should set changed to true', () => {
    spyOn(comp, 'change').and.callThrough();
    const element: DebugElement = getListElement('when', 1);

    expect(comp.changed).toBeFalsy();

    element.nativeElement.children[0].click();
    fixture.detectChanges();

    expect(comp.change).toHaveBeenCalled();
    expect(comp.changed).toBeTruthy();
  });

  it('should submit the changes', () => {
    spyOn(comp, 'change').and.callThrough();
    const element1: DebugElement = getListElement('when', 1);
    const element2: DebugElement = getListElement('when', 2);
    const element3: DebugElement = getListElement('with', 1);

    element1.nativeElement.children[0].click();
    element2.nativeElement.children[0].click();
    element3.nativeElement.children[0].click();
    fixture.detectChanges();

    element3.nativeElement.children[3].children[1].selected = true;
    fixture.detectChanges();

    element3.nativeElement.children[2].dispatchEvent(new Event('change'));
    fixture.detectChanges();

    clientMock.response['api/v1/settings'] = {'status': 'success'};

    getSaveButton().nativeElement.click();

    expect(clientMock.post.calls.mostRecent().args[0]).toBe('api/v1/settings');
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({'notifications': comp.notifications});
    fixture.detectChanges();
  });

});
