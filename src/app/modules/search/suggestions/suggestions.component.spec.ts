///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>

import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { RecentService } from '../../../services/ux/recent';
import { recentServiceMock } from '../../../mocks/services/ux/recent-mock.spec';
import { ContextService } from '../../../services/context.service';
import { contextServiceMock } from '../../../../tests/context-service-mock.spec';
import { SearchBarSuggestionsComponent } from './suggestions.component';
import { Session } from '../../../services/session';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { ConfigsService } from '../../../common/services/configs.service';
import { MockComponent, MockService } from '../../../utils/mock';

/* tslint:disable */

describe('SearchBarSuggestionsComponent', () => {
  let comp: SearchBarSuggestionsComponent;
  let fixture: ComponentFixture<SearchBarSuggestionsComponent>;

  const recentResults = [
    { type: 'user', guid: 1111, username: 'test1', name: 'test1' },
    { type: 'user', guid: 2222, username: 'test2', name: 'test2' },
    { type: 'user', guid: 3333, username: 'test3', name: 'test3' },
    { type: 'user', guid: 4444, username: 'test4', name: 'test4' },
    { type: 'user', guid: 5555, username: 'test5', name: 'test5' },
    { type: 'user', guid: 6666, username: 'test6', name: 'test6' },
    { type: 'user', guid: 7777, username: 'test7', name: 'test7' },
    { type: 'user', guid: 8888, username: 'test8', name: 'test8' },
    { type: 'user', guid: 9999, username: 'test9', name: 'test9' },
    { type: 'user', guid: 1010, username: 'test10', name: 'test10' },
    { type: 'group', guid: 11, name: 'test11' },
    { type: 'group', guid: 12, name: 'test12' },
    { type: 'group', guid: 13, name: 'test13' },
    { type: 'group', guid: 14, name: 'test14' },
    { type: 'group', guid: 15, name: 'test15' },
    { type: 'text', value: 'test16' },
    { type: 'text', value: 'test17' },
    { type: 'text', value: 'test18' },
    { type: 'text', value: 'test19' },
    { type: 'text', value: 'test20' },
  ];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchBarSuggestionsComponent,
        MockComponent({ selector: 'm-loadingEllipsis' }),
      ],
      imports: [
        NgCommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        // CommonModule,
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: RecentService, useValue: recentServiceMock },
        { provide: ContextService, useValue: contextServiceMock },
        { provide: ConfigsService, useValue: { get: (key) => null } },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(SearchBarSuggestionsComponent);
    comp = fixture.componentInstance;

    spyOn(comp.session, 'getLoggedInUser').and.returnValue({ guid: 1234 });

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

  it('should load 20 recent search suggestions when no query', () => {
    recentServiceMock.fetchSuggestions.and.returnValue(recentResults);

    comp.loadRecent();

    expect(recentServiceMock.fetchSuggestions).toHaveBeenCalled();
    expect(comp.recent).toEqual(recentResults);
  });

  it('should hide suggestions when not active', () => {
    let el = fixture.debugElement.query(By.css('.m-searchBarSuggestions'));
    comp.active = false;
    comp.disabled = false;
    comp.recent = [];
    comp.q = 'hello world';

    fixture.detectChanges();
    expect(el.nativeElement.hidden).toBeTruthy();
  });

  it('should be visible when active', () => {
    let el = fixture.debugElement.query(By.css('.m-searchBarSuggestions'));
    comp.active = true;
    comp.disabled = false;
    comp.q = 'hello world';

    fixture.detectChanges();
    expect(el.nativeElement.hidden).toBeFalsy();
  });
});
