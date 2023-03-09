///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>

import { Component, Input } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';

import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ContextService } from '../../services/context.service';
import { contextServiceMock } from '../../../tests/context-service-mock.spec';
import { Session } from '../../services/session';
import { SearchBarComponent } from './bar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { sessionMock } from '../../../tests/session-mock.spec';
import { RecentService } from '../../services/ux/recent';
import { recentServiceMock } from '../../mocks/services/ux/recent-mock.spec';
import { MockDirective } from '../../utils/mock';
import { SharedModule } from '../../common/shared.module';

// Mocks

@Component({
  selector: 'm-searchBar__suggestions',
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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
          SearchBarSuggestionsMock,
          SearchBarComponent,
        ],
        imports: [
          NgCommonModule,
          RouterTestingModule,
          FormsModule,
          ReactiveFormsModule,
          SharedModule,
        ],
        providers: [
          { provide: Session, useValue: sessionMock },
          { provide: ContextService, useValue: contextServiceMock },
          { provide: RecentService, useValue: recentServiceMock },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(SearchBarComponent);
    comp = fixture.componentInstance;

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

    expect(comp.router.navigate).toHaveBeenCalledWith(['/discovery/search'], {
      queryParams: {
        q: 'test',
        f: undefined,
        t: undefined,
      },
    });
  }));

  it('should search with container id', fakeAsync(() => {
    spyOn(comp.router, 'navigate').and.stub();

    comp.q = 'test';
    comp.id = '5000';
    comp.search();
    tick();

    expect(comp.router.navigate).toHaveBeenCalledWith(['/discovery/search'], {
      queryParams: {
        q: 'test',
        f: undefined,
        t: undefined,
      },
    });
  }));

  it('should search when pressing enter', () => {
    spyOn(comp, 'search').and.stub();
    spyOn(comp, 'unsetFocus').and.stub();

    comp.keyup({ keyCode: 13 });

    expect(comp.search).toHaveBeenCalled();
    expect(comp.unsetFocus).toHaveBeenCalled();
  });
});
