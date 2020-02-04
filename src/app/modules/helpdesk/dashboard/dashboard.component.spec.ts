import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { HelpdeskDashboardComponent } from './dashboard.component';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { MockComponent, MockService } from '../../../utils/mock';
import { ConfigsService } from '../../../common/services/configs.service';

describe('HelpdeskDashboardComponent', () => {
  let comp: HelpdeskDashboardComponent;
  let fixture: ComponentFixture<HelpdeskDashboardComponent>;

  function getInput(): DebugElement {
    return fixture.debugElement.query(
      By.css('.m-helpdesk__dashboardInput input')
    );
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HelpdeskDashboardComponent,
        MockComponent({
          selector: 'm-helpdesk--dashboard--all',
        }),
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ uuid: 'uuid1' }) },
        },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;

    jasmine.clock().uninstall();
    jasmine.clock().install();

    clientMock.response = {};
    clientMock.response['api/v2/helpdesk/questions/top'] = {
      status: 'success',
      questions: [
        {
          uuid: 'uuid1',
          question: 'is this a test?',
          answer: 'yep',
          category_uuid: 'category_uuid',
        },
        {
          uuid: 'uuid2',
          question: 'is this a test?',
          answer: 'yep',
          category_uuid: 'category_uuid',
        },
        {
          uuid: 'uuid2',
          question: 'is this a test?',
          answer: 'yep',
          category_uuid: 'category_uuid',
        },
      ],
    };

    fixture = TestBed.createComponent(HelpdeskDashboardComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should have a 'How can we help you @username?' title", () => {
    const h2 = fixture.debugElement.query(
      By.css('.m-helpdesk--dashboard--section h2')
    );

    expect(h2).not.toBeNull();
    expect(h2.nativeElement.textContent).toContain(
      'How can we help you, @test?'
    );
  });

  it('should have a search input', () => {
    const input = getInput();

    expect(input).not.toBeNull();

    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(comp.query).toBe('test');
  });

  it('should have a popular questions section', () => {
    const section = fixture.debugElement.query(
      By.css('.m-helpdeskQuestions__questions')
    );

    expect(section).not.toBeNull();

    expect(
      fixture.debugElement.query(By.css('.m-helpdeskQuestions__questions h4'))
        .nativeElement.textContent
    ).toContain('Popular Questions');

    const questions = fixture.debugElement.queryAll(
      By.css('.m-helpdeskQuestions__question')
    );
    expect(questions.length).toBe(3);
  });

  xit('should have a Help & Support group link', () => {
    const supportGroupLink = fixture.debugElement.query(
      By.css('.m-helpdesk--dashboard--help-and-support')
    );

    expect(supportGroupLink).not.toBeNull();

    const title = fixture.debugElement.query(
      By.css(
        '.m-helpdesk--dashboard--help-and-support .m-helpdesk--dashboard--big-item--text'
      )
    );
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Help & Support Group');

    const subtext = fixture.debugElement.query(
      By.css(
        '.m-helpdesk--dashboard--help-and-support .m-helpdesk--dashboard--big-item--subtext'
      )
    );
    expect(subtext).not.toBeNull();
    expect(subtext.nativeElement.textContent).toContain(
      'Get help from the wider Minds community'
    );
  });

  xit('should have a Token Sales & Enterprise item', () => {
    const tokenSales = fixture.debugElement.query(
      By.css('.m-helpdesk--dashboard--token-sales-and-enterprise')
    );

    expect(tokenSales).not.toBeNull();

    const title = fixture.debugElement.query(
      By.css(
        '.m-helpdesk--dashboard--token-sales-and-enterprise .m-helpdesk--dashboard--big-item--text'
      )
    );
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain(
      'Token Sales & Enterprise'
    );

    const subtext = fixture.debugElement.query(
      By.css(
        '.m-helpdesk--dashboard--token-sales-and-enterprise .m-helpdesk--dashboard--big-item--subtext'
      )
    );
    expect(subtext).not.toBeNull();
    expect(subtext.nativeElement.textContent).toContain(
      'Support with purchasing the Minds Token or your hosted Minds Node'
    );
  });

  it('should have a list of questions', fakeAsync(() => {
    clientMock.get.calls.reset();
    clientMock.response['api/v2/helpdesk/questions/search'] = {
      status: 'success',
      entities: [
        {
          uuid: 'aab9b00d-2481-4bbc-b4b0-bfe861867336',
          question: 'How can I tell if I have a message?',
          answer: 'look at it',
          category_uuid: 'e101ff2e-6fb8-48c3-9902-53f3063ed7ea',
        },
        {
          uuid: '74fdd3b7-9e43-4312-ae2c-f0d0eab66bbe',
          question: 'How can I tell if someone is online?',
          answer: 'an icon',
          category_uuid: 'e101ff2e-6fb8-48c3-9902-53f3063ed7ea',
        },
      ],
    };
    comp.query = 'how to';
    comp.search();
    fixture.detectChanges();
    tick();
    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[1]).toEqual({
      q: 'how to',
      limit: 8,
    });
    expect(comp.noResults).toBe(false);
    expect(comp.results.length).toBe(2);
    expect(comp.results[0].question).toBe(
      'How can I tell if I have a message?'
    );
    expect(comp.results[1].question).toBe(
      'How can I tell if someone is online?'
    );
  }));

  it('should display message when no search results', fakeAsync(() => {
    clientMock.get.calls.reset();
    clientMock.response['api/v2/helpdesk/questions/search'] = {
      status: 'success',
      entities: [],
    };
    comp.query = 'tell me';
    comp.search();
    fixture.detectChanges();
    tick();
    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[1]).toEqual({
      q: 'tell me',
      limit: 8,
    });
    expect(comp.noResults).toBe(true);
    expect(comp.results.length).toBe(0);
  }));
});
