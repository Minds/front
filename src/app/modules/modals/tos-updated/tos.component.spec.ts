import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';
import { TOSUpdatedModal } from './tos.component';
import { MockComponent } from '../../../utils/mock';
import { clientMock } from '../../../../tests/client-mock.spec';
import { Client } from '../../../common/api/client.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';


fdescribe('TOSUpdatedModal', () => {

  let comp: TOSUpdatedModal;
  let fixture: ComponentFixture<TOSUpdatedModal>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [MockComponent({
        selector: 'm-modal',
        template: '<ng-content></ng-content>',
        inputs: ['open'],
        outputs: ['closed']
      }), TOSUpdatedModal],
      imports: [RouterTestingModule, ReactiveFormsModule, CommonModule, FormsModule],
      providers: [
        { provide: Client, useValue: clientMock },
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().install();

    window.Minds = <any>{
      user: {
        username: 'minds'
      },
      site_url: 'http://localhost/'
    };

    clientMock.response = {};

    fixture = TestBed.createComponent(TOSUpdatedModal);

    comp = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable()
        .then(() => done());
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a m-modal', () => {
    expect(fixture.debugElement.query(By.css('m-modal'))).not.toBeNull();
  });

  it('should have the username', () => {
    const text: DebugElement = fixture.debugElement.query(By.css('.m-modal--tos-updated--centered-text'));
    expect(text).not.toBeNull();
    expect(text.nativeElement.textContent).toContain('@minds,');
  });

  it('should have a notice', () => {
    const paragraphs: DebugElement[] = fixture.debugElement.queryAll(By.css('.mdl-card__supporting-text > p:not(.m-modal--tos-updated--centered-text)'));
    expect(paragraphs.length).toBe(2);
    expect(paragraphs[0].nativeElement.textContent).toContain('We\'ve recently updated our Terms of Service and Privacy Policy to reflect the recent changes to the network with the launch of the MINDS token. Please take a moment to read through these documents carefully.');
    expect(paragraphs[1].nativeElement.textContent).toContain('Please also note that your continued use of Minds serves as acceptance of these new terms and policies. Thank you!');
  });

  it('should update the user when opening', fakeAsync(() => {
    const url = 'api/v2/settings/tos';
    clientMock.response[url] = { status: 'success', timestamp: 1234 };

    comp._open = true;
    tick();
    fixture.detectChanges();

    expect(clientMock.post).toHaveBeenCalled();

    expect(clientMock.post.calls.mostRecent().args[0]).toBe(url);
    expect(comp.user.last_accepted_tos).toBe(1234);
  }));

  it('should close the modal', () => {
    comp.open = true;
    spyOn(comp.closed, 'next').and.stub();
    comp.close();

    expect(comp.open).toBeFalsy();
    expect(comp.closed.next).toHaveBeenCalled();
  });
});
