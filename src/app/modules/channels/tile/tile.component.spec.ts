///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { Mock, MockComponent, MockService } from '../../../utils/mock';

import { CommonModule as NgCommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { FormsModule } from '@angular/forms';
import { MaterialSwitchMock } from '../../../../tests/material-switch-mock.spec';
import { ChannelsTileComponent } from './tile.component';
import { Session } from '../../../services/session';
import { ConfigsService } from '../../../common/services/configs.service';

describe('ChannelsTileComponent', () => {
  let comp: ChannelsTileComponent;
  let fixture: ComponentFixture<ChannelsTileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MaterialMock,
        MaterialSwitchMock,
        ChannelsTileComponent,
        MockComponent({
          selector: 'm-channel--social-profiles',
          inputs: ['user', 'editing'],
        }),
        MockComponent({
          selector: 'minds-button-feature',
          inputs: ['object'],
        }),
        MockComponent({
          selector: 'minds-avatar',
          inputs: ['object', 'src', 'editMode', 'waitForDoneSignal'],
        }),
        MockComponent({
          selector: 'm-channel--badges',
          inputs: ['user', 'badges'],
        }),
        MockComponent({
          selector: 'minds-button-subscribe',
          inputs: ['user'],
        }),
        MockComponent({
          selector: 'm-safe-toggle',
          inputs: ['entity'],
        }),
        MockComponent({
          selector: 'minds-button-boost',
          inputs: ['object'],
        }),
      ],
      imports: [FormsModule, RouterTestingModule, NgCommonModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents(); // compile template and css
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(ChannelsTileComponent);
    comp = fixture.componentInstance;
    comp.entity = {
      guid: 'guidguid',
      name: 'name',
      username: 'username',
      city: 'awasa',
      icontime: 11111,
      subscribers_count: 182,
      impressions: 18200,
    };

    spyOn(
      fixture.debugElement.injector.get(Session),
      'getLoggedInUser'
    ).and.returnValue({
      guid: 'guidguid1',
      type: 'user',
      subtype: false,
      time_created: '1499978809',
      time_updated: false,
      container_guid: '0',
      owner_guid: '0',
      site_guid: false,
      access_id: '2',
      name: 'minds',
      username: 'minds',
      language: 'en',
      icontime: '1506690756',
      legacy_guid: false,
      featured_id: false,
      banned: 'no',
      website: '',
      dob: '',
      gender: '',
      city: '',
      merchant: {},
      boostProPlus: false,
      fb: false,
      mature: 0,
      monetized: '',
      signup_method: false,
      social_profiles: [],
      feature_flags: false,
      programs: ['affiliate'],
      plus: false,
      verified: false,
      disabled_boost: false,
      show_boosts: false,
      chat: true,
      subscribed: false,
      subscriber: false,
      subscriptions_count: 1,
      impressions: 10248,
      boost_rating: '2',
      spam: 0,
      deleted: 0,
    });

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

  it('Should load correctly', () => {
    const tile = fixture.debugElement.query(By.css('.m-channels--tile'));
    const subscribe = fixture.debugElement.query(
      By.css('minds-button-subscribe')
    );
    const feature = fixture.debugElement.query(By.css('minds-button-feature'));
    const boost = fixture.debugElement.queryAll(By.css('minds-button-boost'));
    expect(tile).not.toBeNull();
    expect(subscribe).not.toBeNull();
    expect(boost).not.toBeNull();
    expect(feature).not.toBeNull();
  });
});
