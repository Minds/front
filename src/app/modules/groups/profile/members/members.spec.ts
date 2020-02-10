import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { GroupsProfileMembers } from './members';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Session } from '../../../../services/session';
import {
  MockComponent,
  MockDirective,
  MockService,
} from '../../../../utils/mock';
import { GroupsService } from '../../groups-service';
import { MindsHttpClient } from '../../../../common/api/client.service';
import { mindsHttpClientMock } from '../../../../mocks/common/api/minds-http-client.service.mock';
import { groupsServiceMock } from '../../../../mocks/modules/groups/groups.service.mock';
import { ConfigsService } from '../../../../common/services/configs.service';

const user = {
  guid: '1000',
  admin: true,
  plus: false,
  disabled_boost: false,
  username: 'test',
  boost_rating: 1,
};
let sessionConfig = {
  isAdmin: user.admin,
  isLoggedIn: true,
  getLoggedInUser: user,
};

let sessionMock: any = MockService(Session, sessionConfig);

describe('GroupsProfileMembers', () => {
  let comp: GroupsProfileMembers;
  let fixture: ComponentFixture<GroupsProfileMembers>;

  function getSearchInput(): DebugElement {
    return fixture.debugElement.query(
      By.css('.m-groupMembers__search > input')
    );
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'minds-groups-profile-members-invite',
          template: '',
          inputs: ['group'],
          outputs: ['invited'],
        }),
        MockComponent({
          selector: 'minds-card-user',
          template: '<ng-content></ng-content>',
          inputs: ['object'],
        }),
        MockComponent({
          selector: 'minds-groups-card-user-actions-button',
          template: '',
          inputs: ['group', 'user'],
        }),
        MockDirective({
          selector: 'infinite-scroll',
          inputs: ['moreData', 'inProgress'],
          outputs: ['load'],
        }),

        GroupsProfileMembers,
      ],
      imports: [RouterTestingModule, FormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: MindsHttpClient, useValue: mindsHttpClientMock },
        { provide: GroupsService, useValue: groupsServiceMock },
        {
          provide: ConfigsService,
          useValue: MockService(ConfigsService, {
            configs: { cdnUrl: 'http://dev.minds.io/' },
          }),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    fixture = TestBed.createComponent(GroupsProfileMembers);

    comp = fixture.componentInstance;

    mindsHttpClientMock.response = {};
    mindsHttpClientMock.response['api/v1/groups/membership/1234'] = {
      status: 'success',
      members: [
        { guid: '1', username: 'test1' },
        { guid: '2', username: 'test2' },
      ],
    };

    comp.canInvite = true;

    comp.group = {
      guid: '1234',
      membership: 0,
      'is:owner': true,
      'is:member': true,
    };

    groupsServiceMock.group.next(comp.group);

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

  it('should have loaded the members', () => {
    expect(mindsHttpClientMock.get).toHaveBeenCalled();
    expect(mindsHttpClientMock.get.calls.mostRecent().args[0]).toBe(
      'api/v1/groups/membership/1234'
    );
  });

  it('should have a minds-groups-profile-members-invite', () => {
    expect(
      fixture.debugElement.query(By.css('minds-groups-profile-members-invite'))
    ).not.toBeNull();
  });

  it('should have a list of invitees from minds-groups-profile-members-invite', () => {
    comp.invitees = [
      {
        guid: '3',
        username: 'test3',
        impressions: 3000,
        subscribers_count: 30,
      },
      {
        guid: '4',
        username: 'test4',
        impressions: 4000,
        subscribers_count: 40,
      },
    ];

    fixture.detectChanges();

    const list = fixture.debugElement.query(By.css('.m-search-inline-list'));

    expect(list).not.toBeNull();

    const img = fixture.debugElement.query(
      By.css('.m-search-inline-list img:first-child')
    );
    expect(img).not.toBeNull();
    expect(img.nativeElement.src).toContain(
      //'http://dev.minds.io/icon/3/small'
      '/icon/3/small'
    );

    const body = fixture.debugElement.query(
      By.css('.m-search-inline-list .m-body')
    );
    expect(body).not.toBeNull();
    expect(body.nativeElement.children[0].textContent).toContain('test3');
  });

  it('should have a search input', () => {
    expect(getSearchInput()).not.toBeNull();
  });

  it('should have a list of members', () => {
    expect(
      fixture.debugElement.query(By.css('.m-groupMembers__memberCard'))
    ).not.toBeNull();

    expect(
      fixture.debugElement.queryAll(
        By.css('.m-groupMembers__memberCard minds-card-user')
      ).length
    ).toBe(2);
  });

  it('should have an infinite-scroll', () => {
    expect(
      fixture.debugElement.query(By.css('infinite-scroll'))
    ).not.toBeNull();
  });
});
