///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>

import { Component, Input } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { ComponentFixture, async, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { Client } from '../../services/api/client';
import { clientMock } from '../../../tests/client-mock.spec';
import { MindsTitle } from '../../services/ux/title';
import { Storage } from '../../services/storage';
import { storageMock } from "../../../tests/storage-mock.spec";

import { SearchComponent } from './search.component';

import { InfiniteScrollMock } from '../../mocks/common/components/infinite-scroll/infinite-scroll';
import { TooltipComponentMock } from '../../mocks/common/components/tooltip/tooltip.component';
import { MaterialBoundSwitchComponentMock } from '../../mocks/common/components/material/bound-switch.component';

// Internal mocks

@Component({
  selector: 'm-search--hybrid-list',
  template: ''
})
class SearchHybridListComponentMock {
  @Input() entities;
}

@Component({
  selector: 'm-search--simple-list',
  template: ''
})
class SearchSimpleListComponentMock {
  @Input() entities;
}

// Spec

describe('Search', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let comp: SearchComponent;

  // Helpers

  // Setup

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InfiniteScrollMock,
        TooltipComponentMock,
        MaterialBoundSwitchComponentMock,
        SearchHybridListComponentMock,
        SearchSimpleListComponentMock,
        SearchComponent
      ],
      imports: [
        NgCommonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: MindsTitle, useClass: Title, deps: [ Title ] },
        { provide: Storage, useValue: storageMock }
      ]
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(SearchComponent);
    comp = fixture.componentInstance;

    clientMock.response = {};

    clientMock.response[ `api/v2/search` ] = {
      status: 'success',
      entities: [ 5000, 5001 ]
    };

    clientMock.response[ `api/v2/search/top` ] = {
      status: 'success',
      entities: {
        user: [ 1000, 1001 ],
        group: [ 2000, 2001 ],
        activity: [ 5000, 5001 ]
      }
    };

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

  it('should search', fakeAsync(() => {
    comp.inProgress = false;
    comp.offset = '';
    comp.q = 'test';
    comp.type = 'activity';
    comp.container = '';
    comp.mature = true;
    comp.paywall = true;

    clientMock.get.calls.reset();

    comp.search(true);

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();

    const args = clientMock.get.calls.mostRecent().args;

    expect(args[0]).toBe(`api/v2/search`);
    expect(args[1]).toEqual({
      q: 'test',
      container: '',
      limit: 12,
      offset: '',
      taxonomies: 'activity'
    });
  }));

  it('should search top', fakeAsync(() => {
    comp.inProgress = false;
    comp.offset = '';
    comp.q = 'test';
    comp.type = '';
    comp.container = '';
    comp.mature = true;
    comp.paywall = true;

    clientMock.get.calls.reset();

    comp.search(true);

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();

    const args = clientMock.get.calls.mostRecent().args;

    expect(args[0]).toBe(`api/v2/search/top`);
    expect(args[1]).toEqual({
      q: 'test',
      container: '',
      limit: 12,
      offset: '',
      sort: ''
    });
  }));

  it('should search latest', fakeAsync(() => {
    comp.inProgress = false;
    comp.offset = '';
    comp.q = 'test';
    comp.type = 'latest';
    comp.container = '';
    comp.mature = true;
    comp.paywall = true;

    clientMock.get.calls.reset();

    comp.search(true);

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();

    const args = clientMock.get.calls.mostRecent().args;

    expect(args[0]).toBe(`api/v2/search/top`);
    expect(args[1]).toEqual({
      q: 'test',
      container: '',
      limit: 12,
      offset: '',
      sort: 'latest'
    });
  }));

  it('should search and concat results', fakeAsync(() => {
    comp.inProgress = false;
    comp.offset = '';
    comp.q = 'test';
    comp.type = 'activity';
    comp.container = '';
    comp.mature = true;
    comp.paywall = true;

    comp.entities = [ 4998, 4999 ];

    clientMock.get.calls.reset();
    comp.search(false);

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();

    tick();

    expect(comp.entities).toEqual([ 4998, 4999, 5000, 5001 ]);
  }));

  it('should search and replace results', fakeAsync(() => {
    comp.inProgress = false;
    comp.offset = '';
    comp.q = 'test';
    comp.type = 'activity';
    comp.container = '';
    comp.mature = true;
    comp.paywall = true;

    comp.entities = [ 4998, 4999 ];

    clientMock.get.calls.reset();
    comp.search(true);

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();

    tick();

    expect(comp.entities).toEqual([ 5000, 5001 ]);
  }));

  it('should search with an offset', fakeAsync(() => {
    comp.inProgress = false;
    comp.offset = '123';
    comp.q = 'test';
    comp.type = 'activity';
    comp.container = '';
    comp.mature = true;
    comp.paywall = true;

    clientMock.get.calls.reset();

    comp.search(false);

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();

    const args = clientMock.get.calls.mostRecent().args;

    expect(args[0]).toBe(`api/v2/search`);
    expect(args[1]).toEqual({
      q: 'test',
      container: '',
      limit: 12,
      offset: '123',
      taxonomies: 'activity'
    });
  }));

  it('should search top and replace results', fakeAsync(() => {
    comp.inProgress = false;
    comp.offset = '';
    comp.q = 'test';
    comp.type = '';
    comp.container = '';
    comp.mature = true;
    comp.paywall = true;

    comp.hybridEntities = {
      user: [ 999 ],
      group: [ 1999 ],
      'object:video': [],
      'object:image': [],
      'object:blog': [],
      activity: [ 4999 ]
    };

    clientMock.get.calls.reset();
    comp.search(true);

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();

    tick();

    expect(comp.hybridEntities.user).toEqual([ 1000, 1001 ]);
    expect(comp.hybridEntities.group).toEqual([ 2000, 2001 ]);
    expect(comp.hybridEntities.activity).toEqual([ 5000, 5001 ]);
  }));

  it('should search top and concat results', fakeAsync(() => {
    comp.inProgress = false;
    comp.offset = '';
    comp.q = 'test';
    comp.type = '';
    comp.container = '';
    comp.mature = true;
    comp.paywall = true;

    comp.hybridEntities = {
      user: [ 999 ],
      group: [ 1999 ],
      'object:video': [],
      'object:image': [],
      'object:blog': [],
      activity: [ 4999 ]
    };

    clientMock.get.calls.reset();
    comp.search(false);

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();

    tick();

    expect(comp.hybridEntities.user).toEqual([ 999, 1000, 1001 ]);
    expect(comp.hybridEntities.group).toEqual([ 1999, 2000, 2001 ]);
    expect(comp.hybridEntities.activity).toEqual([ 4999, 5000, 5001 ]);
  }));

  it('should search with an offset', fakeAsync(() => {
    comp.inProgress = false;
    comp.offset = '123';
    comp.q = 'test';
    comp.type = 'activity';
    comp.container = '';
    comp.mature = true;
    comp.paywall = true;

    clientMock.get.calls.reset();

    comp.search(false);

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();

    const args = clientMock.get.calls.mostRecent().args;

    expect(args[0]).toBe(`api/v2/search`);
    expect(args[1]).toEqual({
      q: 'test',
      container: '',
      limit: 12,
      offset: '123',
      taxonomies: 'activity'
    });
  }));

  it('should search within a container', fakeAsync(() => {
    comp.inProgress = false;
    comp.offset = '';
    comp.q = 'test';
    comp.type = 'activity';
    comp.container = '1000';
    comp.mature = true;
    comp.paywall = true;

    clientMock.get.calls.reset();

    comp.search(true);

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();

    const args = clientMock.get.calls.mostRecent().args;

    expect(args[0]).toBe(`api/v2/search`);
    expect(args[1]).toEqual({
      q: 'test',
      container: '1000',
      limit: 12,
      offset: '',
      taxonomies: 'activity'
    });
  }));

  it('should search excluding mature or exclusive', fakeAsync(() => {
    comp.inProgress = false;
    comp.offset = '';
    comp.q = 'test';
    comp.type = 'activity';
    comp.container = '';
    comp.mature = false;
    comp.paywall = false;

    clientMock.get.calls.reset();

    comp.search(true);

    fixture.detectChanges();
    tick();

    expect(clientMock.get).toHaveBeenCalled();

    const args = clientMock.get.calls.mostRecent().args;

    expect(args[0]).toBe(`api/v2/search`);
    expect(args[1]).toEqual({
      q: 'test',
      container: '',
      limit: 12,
      offset: '',
      taxonomies: 'activity',
      mature: 0,
      paywall: 0
    });
  }));

  it('should toggle mature', () => {
    comp.mature = false;

    comp.toggleMature();
    expect(comp.mature).toBe(true);

    comp.toggleMature();
    expect(comp.mature).toBe(false);
  });

  it('should toggle paywall', () => {
    comp.paywall = false;

    comp.togglePaywall();
    expect(comp.paywall).toBe(true);

    comp.togglePaywall();
    expect(comp.paywall).toBe(false);
  });

  it('should load options from storage', () => {
    storageMock.set('search:options', JSON.stringify({ mature: true, paywall: true }));

    comp.loadOptions();

    expect(comp.mature).toBe(true);
    expect(comp.paywall).toBe(true);
  });

  it('should save options to storage', () => {
    storageMock.destroy('search:options');

    comp.mature = true;
    comp.paywall = true;
    comp.saveOptions();

    let savedOptions = storageMock.get('search:options');
    expect(savedOptions).toBe(JSON.stringify({ mature: true, paywall: true }));
  });

  it('should test for refs', () => {
    comp.ref = '';
    expect(comp.hasRef('test')).toBe(false);

    comp.ref = 'test';
    expect(comp.hasRef('test')).toBe(true);

    comp.ref = 'test-subtest';
    expect(comp.hasRef('test')).toBe(true);
    expect(comp.hasRef('subtest')).toBe(true);

    comp.ref = 'supertest-test';
    expect(comp.hasRef('supertest')).toBe(true);
    expect(comp.hasRef('test')).toBe(true);
    expect(comp.hasRef('subtest')).toBe(false);

    comp.ref = 'test';
    expect(comp.hasRef('not-a-spec')).toBe(false);
  });

});
