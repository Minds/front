import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { RelatedQuestionsComponent } from './related.component';
import { Session } from '../../../../services/session';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { Client } from '../../../../services/api/client';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockComponent } from '../../../../utils/mock';
import { SafePipe } from '../../../../common/pipes/safe';

describe('RelatedQuestionsComponent', () => {
  let comp: RelatedQuestionsComponent;
  let fixture: ComponentFixture<RelatedQuestionsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          SafePipe,
          RelatedQuestionsComponent,
          MockComponent({
            selector: 'minds-activity',
            inputs: ['object'],
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
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;

    clientMock.response = {};

    fixture = TestBed.createComponent(RelatedQuestionsComponent);

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
});
