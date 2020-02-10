import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { GroupsProfileMembersInvite } from './invite';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Session } from '../../../../../services/session';
import { clientMock } from '../../../../../../tests/client-mock.spec';
import { Client } from '../../../../../services/api/client';
import { MockDirective, MockService } from '../../../../../utils/mock';
import { GroupsService } from '../../../groups-service';
import { ConfigsService } from '../../../../../common/services/configs.service';

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

let groupsServiceMock: any = MockService(GroupsService, sessionConfig);

describe('GroupsProfileMembersInvite', () => {
  let comp: GroupsProfileMembersInvite;
  let fixture: ComponentFixture<GroupsProfileMembersInvite>;

  function getSearchInput(): DebugElement {
    return fixture.debugElement.query(By.css('.m-search-inline > input'));
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockDirective({ selector: '[mdl]', inputs: ['mdl'] }),
        GroupsProfileMembersInvite,
      ],
      imports: [RouterTestingModule, FormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
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
    fixture = TestBed.createComponent(GroupsProfileMembersInvite);

    comp = fixture.componentInstance;

    comp.group = {
      guid: 123,
    };

    clientMock.response = {};

    comp._group = {
      guid: '1234',
      name: 'test group',
      membership: 0,
      'is:owner': true,
      'is:member': true,
    };

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

  it('should have a title saying Invite to <<group name>>', () => {
    expect(
      fixture.debugElement.query(By.css('h2')).nativeElement.textContent
    ).toContain('Invite to test group');
  });

  it('should have a brief explanation', () => {
    const instructions = fixture.debugElement.queryAll(
      By.css('.m-groupMemberInvite__instructions > li')
    );

    expect(instructions.length).toBe(3);

    expect(instructions[0].nativeElement.textContent).toContain(
      'You can only invite users who are your subscribers'
    );
    expect(instructions[1].nativeElement.textContent).toContain(
      'They will receive a notification to confirm they want to be a member of this group'
    );
    expect(instructions[2].nativeElement.textContent).toContain(
      'If the user was banned from the group, inviting them will lift the ban'
    );
  });

  it('should have a search input', () => {
    expect(getSearchInput()).not.toBeNull();
  });

  it("should search for users after modifying the input's value", fakeAsync(() => {
    clientMock.response['api/v2/search/suggest/user'] = {
      status: 'success',
      entities: [
        {
          guid: '1',
          icontime: '1',
          username: 'test1',
          impressions: 1000,
          subscribers_count: 10,
        },
        {
          guid: '2',
          icontime: '2',
          username: 'test2',
          impressions: 2000,
          subscribers_count: 20,
        },
      ],
    };

    const input = getSearchInput();

    input.nativeElement.value = 'test';
    input.nativeElement.dispatchEvent(new Event('input'));
    input.nativeElement.dispatchEvent(new Event('keyup'));

    tick(800);

    fixture.detectChanges();

    expect(comp.users).toEqual([
      {
        guid: '1',
        icontime: '1',
        username: 'test1',
        impressions: 1000,
        subscribers_count: 10,
      },
      {
        guid: '2',
        icontime: '2',
        username: 'test2',
        impressions: 2000,
        subscribers_count: 20,
      },
    ]);

    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toBe(
      'api/v2/search/suggest/user'
    );
  }));

  it('should have a list of users', () => {
    comp.users = [
      {
        guid: '1',
        icontime: '1',
        username: 'test1',
        impressions: 1000,
        subscribers_count: 10,
      },
      {
        guid: '2',
        icontime: '2',
        username: 'test2',
        impressions: 2000,
        subscribers_count: 20,
      },
    ];

    fixture.detectChanges();

    const img = fixture.debugElement.query(By.css('.m-search-inline-item img'));
    expect(img).not.toBeNull();
    expect(img.nativeElement.src).toContain(
      //'http://dev.minds.io/icon/1/small/1'
      '/icon/1/small/1'
    );

    const body = fixture.debugElement.query(
      By.css('.m-search-inline-item .m-body')
    );
    expect(body).not.toBeNull();
    expect(body.nativeElement.children[0].textContent).toContain('test1');
  });
});
