import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import {
  Component,
  DebugElement,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { By } from '@angular/platform-browser';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { clientMock } from '../../../../tests/client-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { SettingsWireComponent } from './wire.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { TooltipComponentMock } from '../../../mocks/common/components/tooltip/tooltip.component';
import { WireRewardsTiers } from '../../wire/interfaces/wire.interfaces';
import { AutoGrow } from '../../../common/directives/autogrow';
import { Upload } from '../../../services/api/upload';
import { uploadMock } from '../../../../tests/upload-mock.spec';
import { MockService } from '../../../utils/mock';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-wire--lock-screen',
  template: '',
})
export class WireLockScreenComponentMock {
  @Input() entity: any;
  @Output('entityChange') update: EventEmitter<any> = new EventEmitter<any>();

  @Input() preview: any;
}

@Component({
  selector: 'm-wire-console--rewards--inputs',
  template: '',
})
export class WireConsoleRewardsInputsComponentMock {
  @Input() channel: any;
  @Input() rewards: WireRewardsTiers = [];

  @Output('rewardsChange') update: EventEmitter<
    WireRewardsTiers
  > = new EventEmitter<WireRewardsTiers>();
}

@Component({
  selector: 'm-notifications--toaster',
  template: '',
})
export class NotificationsToasterComponentMock {
  @Input() notifications: Array<any> = [];

  listenForNotifications() {}

  closeNotification(notification: any) {}
}

describe('SettingsWireComponent', () => {
  let comp: SettingsWireComponent;
  let fixture: ComponentFixture<SettingsWireComponent>;
  let debugElement: DebugElement;
  let sessionService: Session;
  let sessionGetLoggedUserSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TooltipComponentMock,
        WireConsoleRewardsInputsComponentMock,
        WireLockScreenComponentMock,
        MaterialMock,
        SettingsWireComponent,
        AutoGrow,
        //NotificationsToasterComponentMock,
      ],
      imports: [
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        NgCommonModule,
      ], //CommonModule
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: Upload, useValue: uploadMock },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(SettingsWireComponent);
    clientMock.response = {};

    comp = fixture.componentInstance;

    debugElement = fixture.debugElement;
    sessionService = debugElement.injector.get(Session);
    sessionGetLoggedUserSpy = spyOn(
      sessionService,
      'getLoggedInUser'
    ).and.returnValue({
      merchant: {
        exclusive: null,
      },
      wire_rewards: {
        description:
          'Subscribe to my reward tiers below and help support my content!',
        rewards: {
          tokens: [
            {
              amount: 10,
              description: 'reward',
            },
          ],
        },
      },
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

  it('should have a topbar with a save button', () => {
    expect(fixture.debugElement.query(By.css('.m-layout--row'))).not.toBeNull();
    expect(
      fixture.debugElement.query(By.css('.m-layout--row > .m-btn'))
    ).not.toBeNull();
  });

  it('should have a paywall section', () => {
    expect(
      fixture.debugElement.query(By.css('.m-settings--wire--paywall'))
    ).not.toBeNull();
  });
  it('paywall section should have a subtext', () => {
    const p: DebugElement = fixture.debugElement.query(
      By.css('.m-settings--wire--paywall p')
    );
    expect(p).not.toBeNull();
    expect(p.nativeElement.textContent).toContain(
      'The below description and preview image is what your subscribers will see on your exclusive posts until they become a supporter.'
    );
  });
  it('paywall section should have a description input', () => {
    expect(
      fixture.debugElement.query(
        By.css('.m-settings--wire--paywall-intro input')
      )
    ).not.toBeNull();
  });
  it('paywall section should have a background selector', () => {
    expect(
      fixture.debugElement.query(
        By.css('.m-settings--wire--paywall-background input')
      )
    ).not.toBeNull();
  });
  it('paywall section should have a selected background preview', () => {
    expect(
      fixture.debugElement.query(
        By.css('.m-settings--wire--paywall-preview m-wire--lock-screen')
      )
    ).not.toBeNull();
  });
});
