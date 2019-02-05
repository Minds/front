import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { SearchQuestionsComponent } from './search.component';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { Client } from '../../../../services/api/client';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockComponent } from '../../../../utils/mock';
import { SafePipe } from "../../../../common/pipes/safe";

describe('SearchQuestionsComponent', () => {

  let comp: SearchQuestionsComponent;
  let fixture: ComponentFixture<SearchQuestionsComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        SafePipe,
        SearchQuestionsComponent,
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
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;

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

    clientMock.response['api/v2/helpdesk/categories/category/category_uuid'] = {
      'status': 'success',
      category: {
        uuid: 'category_uuid',
        title: 'category',
      }
    };

    fixture = TestBed.createComponent(SearchQuestionsComponent);

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

});
