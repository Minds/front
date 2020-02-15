///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { MockComponent } from '../../../utils/mock';
import { CommonModule as NgCommonModule } from '@angular/common';
import { ChannelModeSelectorComponent } from './channel-mode-selector.component';
import { ChannelMode } from '../../../interfaces/entities';
import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { componentFactoryName } from '@angular/compiler';

describe('ChannelModeSelector', () => {
  let comp: ChannelModeSelectorComponent;
  let fixture: ComponentFixture<ChannelModeSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownComponent, ChannelModeSelectorComponent],
      providers: [{ provide: Client, useValue: clientMock }],
    }).compileComponents();
  }));

  beforeEach(done => {
    fixture = TestBed.createComponent(ChannelModeSelectorComponent);
    clientMock.response = {};
    comp = fixture.componentInstance;

    comp.user = {
      guid: 'guidguid',
      name: 'name',
      username: 'username',
      icontime: 11111,
      subscribers_count: 182,
      impressions: 18200,
      mode: ChannelMode.PUBLIC,
      nsfw: [],
    };

    clientMock.response['api/v1/channel/info'] = { status: 'success' };
    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('it should change mode to moderated', () => {
    spyOn(comp.channelModeDropdown, 'close');
    comp.setChannelMode(ChannelMode.MODERATED);
    fixture.detectChanges();
    expect(comp.user.mode).toEqual(ChannelMode.MODERATED);
    expect(clientMock.post.calls.mostRecent().args[0]).toEqual(
      'api/v1/channel/info'
    );
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual(comp.user);
    expect(comp.channelModeDropdown.close).toHaveBeenCalled();
  });

  it('it should change mode to closed', () => {
    spyOn(comp.channelModeDropdown, 'close');
    comp.setChannelMode(ChannelMode.CLOSED);
    fixture.detectChanges();
    expect(comp.user.mode).toEqual(ChannelMode.CLOSED);
    expect(clientMock.post.calls.mostRecent().args[0]).toEqual(
      'api/v1/channel/info'
    );
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual(comp.user);
    expect(comp.channelModeDropdown.close).toHaveBeenCalled();
  });

  it('it should change mode to open', () => {
    spyOn(comp.channelModeDropdown, 'close');
    comp.setChannelMode(ChannelMode.PUBLIC);
    fixture.detectChanges();
    expect(comp.user.mode).toEqual(ChannelMode.PUBLIC);
    expect(clientMock.post.calls.mostRecent().args[0]).toEqual(
      'api/v1/channel/info'
    );
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual(comp.user);
    expect(comp.channelModeDropdown.close).toHaveBeenCalled();
  });

  it('it should not change when disabled', () => {
    spyOn(comp.channelModeDropdown, 'close');
    clientMock.post.calls.reset();
    comp.enabled = false;
    fixture.detectChanges();
    comp.setChannelMode(ChannelMode.PUBLIC);
    fixture.detectChanges();
    expect(comp.user.mode).toEqual(ChannelMode.PUBLIC);
    expect(clientMock.post).not.toHaveBeenCalled();
    expect(comp.channelModeDropdown.close).not.toHaveBeenCalled();
  });
});
