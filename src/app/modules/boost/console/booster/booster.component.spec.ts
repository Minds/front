import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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

describe('BoostConsoleBooster', () => {

  let comp: BoostConsoleBooster;
  let fixture: ComponentFixture<BoostConsoleBooster>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        MockComponent({ selector: 'minds-card', inputs: ['object', 'hostClass'] }),
        MockComponent({ selector: 'minds-button', inputs: ['object', 'type'] }),
        BoostConsoleBooster
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: Session, useValue: sessionMock },
        { provide: ActivatedRoute, useValue: { parent: { url: of([{ path: 'newsfeed' }]) } } }
      ]
    })
      .compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    jasmine.clock().install();

    fixture = TestBed.createComponent(BoostConsoleBooster);

    comp = fixture.componentInstance;

    clientMock.response = {};
    clientMock.response['api/v1/newsfeed/personal'] = {
      status: 'success',
      activity: [
        { guid: '123' },
        { guid: '456' },
      ]
    };

    clientMock.response['api/v1/entities/owner'] = {
      status: 'success',
      entities: [
        { guid: '789' },
        { guid: '101112' },
      ]
    };

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable()
        .then(() => {
          fixture.detectChanges();
          done()
        });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have loaded the lists', () => {
    expect(comp.posts).toEqual([
      { guid: '123' },
      { guid: '456' },
    ]);
    expect(comp.media).toEqual([
      { guid: '789' },
      { guid: '101112' },
    ]);
  });

  it('should have a title', () => {
    const title = fixture.debugElement.query(By.css('.m-boost-console-booster--cta span'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain('Boosting guarantees more views on your posts and content.');
  });

  it('should have a list of activities', () => {
    const list = fixture.debugElement.query(By.css('.m-boost-console--booster--posts-list'));
    expect(list).not.toBeNull();
    expect(list.nativeElement.children.length).toBe(2);
  });

  it("should have a poster if the user hasn't posted anything yet", () => {
    fixture.detectChanges();
    comp.posts = [];
    fixture.detectChanges();

    const title = fixture.debugElement.query(By.css('.m-boost-console-booster--content h3'));
    expect(title).not.toBeNull();
    expect(title.nativeElement.textContent).toContain("You have no content yet. Why don't you post something?");


    const poster = fixture.debugElement.query(By.css('.m-boost-console-booster--content div:last-child'));
    expect(poster).not.toBeNull();
    expect(poster.nativeElement.hidden).toBeFalsy();
  });

});
