///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>

import { Component, Input } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ContextService } from '../../services/context.service';
import { contextServiceMock } from '../../../tests/context-service-mock.spec';
import { Session } from '../../services/session';
import { SearchBarComponent } from './bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { sessionMock } from '../../../tests/session-mock.spec';
import { FeaturesService } from '../../services/features.service';
import { featuresServiceMock } from '../../../tests/features-service-mock.spec';
import { RecentService } from '../../services/ux/recent';
import { recentServiceMock } from '../../../tests/minds-recent-service-mock.spec';

// Mocks

@Component({
  selector: 'm-search--bar-suggestions',
  template: '',
})
class SearchBarSuggestionsMock {
  @Input() q: any;
  @Input() active: boolean;
  @Input() disabled: boolean;
}

// Spec

describe('SearchBarComponent', () => {
  let fixture: ComponentFixture<SearchBarComponent>;
  let comp: SearchBarComponent;

  // Helpers

  let _tickWaitFor = (ms: number) => {
    fixture.detectChanges();
    tick();
    jasmine.clock().tick(ms);
  };

  // Setup

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchBarSuggestionsMock, SearchBarComponent],
      imports: [
        NgCommonModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ContextService, useValue: contextServiceMock },
        { provide: FeaturesService, useValue: featuresServiceMock },
        { provide: RecentService, useValue: recentServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(SearchBarComponent);
    comp = fixture.componentInstance;

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

  // Tests

  it(`should handle the current url that's not /search`, fakeAsync(() => {
    comp.handleUrl('/newsfeed');
    _tickWaitFor(100);

    expect(comp.q).toBeFalsy();
    expect(comp.id).toBeFalsy();
    expect(comp.hasSearchContext).toBe(false);
    expect(comp.suggestionsDisabled).toBe(false);

    comp.handleUrl('/something/search');
    _tickWaitFor(100);

    expect(comp.q).toBeFalsy();
    expect(comp.id).toBeFalsy();
    expect(comp.hasSearchContext).toBe(false);
    expect(comp.suggestionsDisabled).toBe(false);
  }));

  it('should handle the current /search url', fakeAsync(() => {
    comp.handleUrl('/search;q=test');
    _tickWaitFor(100);

    expect(comp.q).toBe('test');
    expect(comp.id).toBeFalsy();
    expect(comp.hasSearchContext).toBeTruthy();
    expect(comp.searchContext).toBe('');
    expect(comp.suggestionsDisabled).toBe(true);
  }));

  it('should handle the current /search url with type', fakeAsync(() => {
    comp.handleUrl('/search;q=test;type=karmatest');
    _tickWaitFor(100);

    expect(comp.q).toBe('test');
    expect(comp.id).toBeFalsy();
    expect(comp.hasSearchContext).toBeTruthy();
    expect(comp.searchContext).toBe('karmatest');
    expect(comp.suggestionsDisabled).toBe(true);
  }));

  it('should handle the current /search url with type and container id', fakeAsync(() => {
    comp.handleUrl('/search;q=test;id=5000');
    _tickWaitFor(100);

    expect(comp.q).toBe('test');
    expect(comp.id).toBe('5000');
    expect(comp.hasSearchContext).toBeTruthy();
    expect(comp.searchContext).toBe('5000');
    expect(comp.suggestionsDisabled).toBe(true);
  }));

  it('should set active when focus is called', () => {
    comp.active = false;
    comp.focus();
    expect(comp.active).toBeTruthy();
  });

  it('should unset active a bit later after blur is called', fakeAsync(() => {
    comp.active = true;
    comp.blur();
    _tickWaitFor(200);

    expect(comp.active).toBeFalsy();
  }));

  it('should search', fakeAsync(() => {
    spyOn(comp.router, 'navigate').and.stub();

    comp.q = 'test';
    comp.id = '';
    comp.search();
    tick();

    expect(comp.router.navigate).toHaveBeenCalledWith([
      'search',
      { q: 'test', ref: 'top' },
    ]);
  }));

  it('should search with container id', fakeAsync(() => {
    spyOn(comp.router, 'navigate').and.stub();

    comp.q = 'test';
    comp.id = '5000';
    comp.search();
    tick();

    expect(comp.router.navigate).toHaveBeenCalledWith([
      'search',
      { q: 'test', ref: 'top', id: '5000' },
    ]);
  }));

  it('should search when pressing enter', () => {
    spyOn(comp, 'search').and.stub();
    spyOn(comp, 'unsetFocus').and.stub();

    comp.keyup({ keyCode: 13 });

    expect(comp.search).toHaveBeenCalled();
    expect(comp.unsetFocus).toHaveBeenCalled();
  });
});
