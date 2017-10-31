///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By, Title } from '@angular/platform-browser';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';

import { Client } from '../../services/api/client';
import { clientMock } from '../../../tests/client-mock.spec';
import { MindsTitle } from '../../services/ux/title';

import { GroupsCardMock } from '../../mocks/modules/groups/card/card';
import { InfiniteScrollMock } from '../../mocks/common/components/infinite-scroll/infinite-scroll';
import { Groups } from './groups';
import { ContextService } from '../../services/context.service';
import { contextServiceMock } from '../../../tests/context-service-mock.spec';

describe('Groups', () => {
  let fixture: ComponentFixture<Groups>;
  let comp: Groups;

  /** Helpers */

  function getCreateAnchor(): DebugElement {
    return fixture.debugElement.queryAll(By.directive(RouterLinkWithHref))
      .find(el => el.properties['href'] === '/groups/create');
  }

  function getGroupCards(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('minds-card-group'));
  }

  function getInfiniteScroll(): DebugElement {
    return fixture.debugElement.query(By.css('infinite-scroll'));
  }

  /** /Helpers */

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupsCardMock,
        InfiniteScrollMock,
        Groups
      ],
      imports: [
        NgCommonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: MindsTitle, useClass: Title, deps: [ Title ] },
        { provide: ContextService, useValue: contextServiceMock },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Groups);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should render a button to create a group', () => {
    expect(getCreateAnchor()).toBeTruthy();
  });

  it('should render a list of groups and an infinite scroll', () => {
    comp.groups = [{}, {}];
    fixture.detectChanges();

    expect(getGroupCards().length).toBe(2);
    expect(getInfiniteScroll()).toBeTruthy();
  });
});
