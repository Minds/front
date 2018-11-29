import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { QuestionsComponent } from './questions.component';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { Client } from '../../../../services/api/client';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockComponent } from '../../../../utils/mock';

describe('QuestionsComponent', () => {

  let comp: QuestionsComponent;
  let fixture: ComponentFixture<QuestionsComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        QuestionsComponent,
        MockComponent({
          selector: 'minds-activity',
          inputs: [ 'object' ],
        }),
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: ActivatedRoute, useValue: { params: of({ uuid: 'uuid1' }) } }
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().install();

    clientMock.response = {};
    clientMock.response['api/v2/helpdesk/questions/top'] = {
      'status': 'success',
      questions: [
        {
          uuid: 'uuid1',
          'question': 'is this a test?',
          'answer': 'yep',
          category_uuid: 'category_uuid'
        },
        {
          uuid: 'uuid2',
          question: 'is this a test?',
          answer: 'yep',
          category_uuid: 'category_uuid'
        },
        {
          uuid: 'uuid2',
          question: 'is this a test?',
          answer: 'yep',
          category_uuid: 'category_uuid'
        },
      ]
    };

    clientMock.response['api/v2/helpdesk/questions/question/uuid1'] = {
      'status': 'success',
      question: {
        uuid: 'uuid1',
        question: 'is this a test?',
        answer: 'yep',
        category_uuid: 'category_uuid'
      },
    };

    clientMock.response['api/v2/helpdesk/categories/category/category_uuid'] = {
      'status': 'success',
      category: {
        uuid: 'category_uuid',
        title: 'category',
      }
    };

    fixture = TestBed.createComponent(QuestionsComponent);

    comp = fixture.componentInstance;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable()
        .then(() => {
          fixture.detectChanges();
          done();
        });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should have a 'Go Back' button", () => {
    const button = fixture.debugElement.query(By.css('.m-helpdeskQuestions__goBack'));

    expect(button).not.toBeNull();
    expect(button.nativeElement.textContent).toContain('Back to Help Desk');
  });

  xit("should have a popular questions section", () => {
    const section = fixture.debugElement.query(By.css('.m-helpdeskQuestions__categories'));

    expect(section).not.toBeNull();

    expect(fixture.debugElement.query(By.css('.m-helpdesk--questions--popular-questions--title')).nativeElement.textContent).toContain('Popular questions');

    const questions = fixture.debugElement.queryAll(By.css('.m-helpdesk--questions--popular-questions--question'));
    expect(questions.length).toBe(3);
  });

  it("should have a Help & Support group link", () => {
    const button = fixture.debugElement.query(By.css('.m-helpdesk--questions--help-and-support'));

    expect(button).not.toBeNull();

    const title = fixture.debugElement.query(By.css('.m-helpdesk--questions--help-and-support .m-helpdesk--questions--big-item--title'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Help & Support Group');

    const subtext = fixture.debugElement.query(By.css('.m-helpdesk--questions--help-and-support .m-helpdesk--questions--big-item--subtext'));
    expect(subtext).not.toBeNull();
    expect(subtext.nativeElement.textContent).toContain('Get help from the wider Minds community');
  });

  it("should have a main page section with the question, answer and the upvote and downvote buttons", () => {
    const question = fixture.debugElement.query(By.css('.m-page--main > .m-helpdeskQuestions__question'));

    expect(question).not.toBeNull();
    expect(question.nativeElement.textContent).toContain('is this a test?');

    const answer = fixture.debugElement.query(By.css('.m-page--main .m-helpdeskQuestions__answer'));

    expect(answer).not.toBeNull();
    expect(answer.nativeElement.textContent).toContain('yep');

    const voteButtons = fixture.debugElement.queryAll(By.css('.m-helpdeskQuestions__feedback > div'));
    expect(voteButtons.length).toBe(2);

  });

});
