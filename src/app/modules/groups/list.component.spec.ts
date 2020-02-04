///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>

import { DebugElement, Input, Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By, Title } from '@angular/platform-browser';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';

import { Client } from '../../services/api/client';
import { clientMock } from '../../../tests/client-mock.spec';
import { Session } from '../../services/session';
import { TooltipComponent } from '../../common/components/tooltip/tooltip.component';

import { GroupsCardMock } from '../../mocks/modules/groups/card/card';
import { GroupsListComponent } from './list.component';
import { ContextService } from '../../services/context.service';
import { contextServiceMock } from '../../../tests/context-service-mock.spec';

import { MockComponent, MockService } from '../../utils/mock';
import { OverlayModalService } from '../../services/ux/overlay-modal';
import { overlayModalServiceMock } from '../../../tests/overlay-modal-service-mock.spec';
import { ConfigsService } from '../../common/services/configs.service';
import { Storage } from '../../services/storage';

@Component({
  selector: 'm-groups--tile',
  template: '',
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
    return fixture.debugElement
      .queryAll(By.directive(RouterLinkWithHref))
      .find(el => el.properties['href'] === '/groups/create');
  }

  function getGroupTiles(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('m-groups--tile'));
  }

  function getInfiniteScroll(): DebugElement {
    return fixture.debugElement.query(By.css('infinite-scroll'));
  }

  /** /Helpers */

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GroupsCardMock,
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['inProgress', 'moreData', 'inProgress'],
        }),
        MockComponent({
          selector: 'm-topbar--navigation--options',
          template: '',
          inputs: ['options'],
          outputs: ['change'],
        }),
        MockComponent({
          selector: 'm-topbar--hashtags',
          template: '',
          inputs: ['enabled'],
          outputs: ['selectionChange'],
        }),
        GroupsListComponent,
        GroupsTileMock,
        TooltipComponent,
      ],
      imports: [NgCommonModule, RouterTestingModule],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: ContextService, useValue: contextServiceMock },
        ConfigsService,
        Session,
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        Storage,
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents();
  }));

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(GroupsListComponent);
    comp = fixture.componentInstance;
    clientMock.response = {};
    clientMock.response[`api/v1/entities/trending/groups`] = {
      status: 'success',
      entities: [
        { guid: '858049985139183618', type: 'group', name: 'nicos' },
        { guid: '858049985139183618', type: 'group', name: 'nicos' },
      ],
    };

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should render a list of groups and an infinite scroll', () => {
    comp.entities = [
      { guid: '858049985139183618', type: 'group', name: 'nicos' },
      { guid: '858049985139183618', type: 'group', name: 'nicos' },
    ];
    fixture.detectChanges();

    expect(getGroupTiles().length).toBe(2);
    expect(getInfiniteScroll()).toBeTruthy();
  });

  it('should render a list of groups and do the load', () => {
    spyOn(comp, 'load').and.stub();
    fixture.detectChanges();

    comp.onOptionsChange({ rating: 2 });

    expect(comp.load).toHaveBeenCalled();
    expect(comp.rating).toBe(2);
  });
});
