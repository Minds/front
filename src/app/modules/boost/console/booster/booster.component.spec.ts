import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { BoostConsoleBooster } from './booster.component';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../../tests/session-mock.spec';
import { MockComponent, MockDirective } from '../../../../utils/mock';
import { Client } from '../../../../services/api';
import { Session } from '../../../../services/session';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { FeedsService } from '../../../../common/services/feeds.service';
import { feedsServiceMock } from '../../../../../tests/feed-service-mock.spec';
import { BehaviorSubject } from 'rxjs';

describe('BoostConsoleBooster', () => {
  let comp: BoostConsoleBooster;
  let fixture: ComponentFixture<BoostConsoleBooster>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
          MockComponent({
            selector: 'minds-card',
            inputs: ['object', 'hostClass', 'flags'],
          }),
          MockComponent({
            selector: 'minds-button',
            inputs: ['object', 'type'],
          }),
          MockDirective({
            selector: 'infinite-scroll',
            inputs: ['moreData', 'inProgress'],
            outputs: ['load'],
          }),
          BoostConsoleBooster,
        ],
        imports: [RouterTestingModule, ReactiveFormsModule],
        providers: [
          { provide: Client, useValue: clientMock },
          { provide: Session, useValue: sessionMock },
          {
            provide: ActivatedRoute,
            useValue: { parent: { url: of([{ path: 'newsfeed' }]) } },
          },
          { provide: FeedsService, useValue: feedsServiceMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(BoostConsoleBooster);
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

  it('should have loaded the lists', () => {
    expect(comp.feed$).not.toBeFalsy();
  });

  it('should have a title', () => {
    const title = fixture.debugElement.query(
      By.css('.m-boost-console-booster--cta span')
    );
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain(
      'Boosting guarantees more views on your posts and content.'
    );
  });

  it('should have a list of activities', () => {
    const list = fixture.debugElement.query(
      By.css('.m-boost-console--booster--posts-list')
    );
    expect(list).not.toBeNull();
    expect(list.nativeElement.children.length).toBe(1);
  });
});
