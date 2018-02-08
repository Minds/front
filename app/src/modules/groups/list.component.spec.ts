///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>

import { DebugElement, Input, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By, Title } from '@angular/platform-browser';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';

import { Client } from '../../services/api/client';
import { clientMock } from '../../../tests/client-mock.spec';
import { MindsTitle } from '../../services/ux/title';
import { Session } from '../../services/session';
import { TooltipComponent } from'../../common/components/tooltip/tooltip.component';

import { GroupsCardMock } from '../../mocks/modules/groups/card/card';
import { InfiniteScrollMock } from '../../mocks/common/components/infinite-scroll/infinite-scroll';
import { GroupsListComponent } from './list.component';
import { ContextService } from '../../services/context.service';
import { contextServiceMock } from '../../../tests/context-service-mock.spec';

@Component({
  selector: 'm-groups--tile',
  template: ''
})
class GroupsTileMock {
  @Input() entity;
}

// Spec

describe('Groups List', () => {
  let fixture: ComponentFixture<GroupsListComponent>;
  let comp: GroupsListComponent;

  /** Helpers */

  function getCreateAnchor(): DebugElement {
    return fixture.debugElement.queryAll(By.directive(RouterLinkWithHref))
      .find(el => el.properties['href'] === '/groups/create');
  }

  function getGroupTiles(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('m-groups--tiles'));
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
        GroupsListComponent,
        GroupsTileMock,
        TooltipComponent,
      ],
      imports: [
        NgCommonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: MindsTitle, useClass: Title, deps: [ Title ] },
        { provide: ContextService, useValue: contextServiceMock },
        { provide: Session, useClass: Session }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsListComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
  });

  xit('should render a button to create a group', () => {
    expect(getCreateAnchor()).toBeTruthy();
  });

  it('should render a list of groups and an infinite scroll', () => {
    comp.entities = [{}, {}];
    fixture.detectChanges();

    //TODO: fix this
    //expect(getGroupTiles().length).toBe(2);
    expect(getInfiniteScroll()).toBeTruthy();
  });
});
