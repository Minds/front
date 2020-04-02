///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>

import { CommonModule as NgCommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
import { FeaturesService } from '../../../services/features.service';
import { featuresServiceMock } from '../../../../tests/features-service-mock.spec';
import { IfFeatureDirective } from '../../../common/directives/if-feature.directive';

/* tslint:disable */

describe('SearchBarSuggestionsComponent', () => {
  let comp: SearchBarSuggestionsComponent;
  let fixture: ComponentFixture<SearchBarSuggestionsComponent>;

  const recentResults = [
    { type: 'user', guid: 1111, username: 'test1' },
    { type: 'user', guid: 2222, username: 'test2' },
    { type: 'user', guid: 3333, username: 'test3' },
    { type: 'group', guid: 4444, name: 'test4' },
    { type: 'group', guid: 5555, name: 'test5' },
    { type: 'group', guid: 6666, name: 'test6' },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IfFeatureDirective, SearchBarSuggestionsComponent],
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
        { provide: FeaturesService, useValue: featuresServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(SearchBarSuggestionsComponent);
    comp = fixture.componentInstance;

    spyOn(comp.session, 'getLoggedInUser').and.returnValue({ guid: 1234 });

    featuresServiceMock.mock('top-feeds', false);

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

  it('should load 6 recent search suggestions when no query', () => {
    recentServiceMock.fetch.and.returnValue(recentResults);

    comp.loadRecent();

    expect(recentServiceMock.fetch).toHaveBeenCalledWith('recent:text', 6);
    expect(comp.recent).toEqual(recentResults);
  });

  it('should hide suggestions when not active', () => {
    let el = fixture.debugElement.query(
      By.css('.m-search-bar-suggestions-list')
    );
    comp.active = false;
    comp.q = 'hello world';

    fixture.detectChanges();
    expect(el.nativeElement.hidden).toBeTruthy();
  });

  it('should be visible when active', () => {
    let el = fixture.debugElement.query(
      By.css('.m-search-bar-suggestions-list')
    );
    comp.active = true;

    fixture.detectChanges();
    expect(el.nativeElement.hidden).toBeFalsy();
  });
});
