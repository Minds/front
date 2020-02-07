///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
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

import { Client } from '../../../services/api/client';
import { clientMock } from '../../../../tests/client-mock.spec';
import {
  BoostConsoleComponent,
  BoostConsoleFilter,
  BoostConsoleType,
} from './console.component';
import { BoostService } from '../boost.service';
import { TooltipComponentMock } from '../../../mocks/common/components/tooltip/tooltip.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { DateSelectorComponent } from '../../../common/components/date-selector/date-selector.component';
import { MindsCardMock } from '../../../../tests/minds-card-mock.spec';

@Component({
  selector: 'm-date-selector',
  template: '',
})
export class DateSelectorComponentMock {
  @Input() label: string;
  @Input() date: string;
  @Output() dateChange: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'm-boost-console-booster',
  template: '',
})
export class BoostConsoleBoosterMock {
  @Input('type') type: BoostConsoleType;

  load(refresh?: boolean) {}
}

@Component({
  selector: 'm-third-party-networks-facebook',
  template: '',
})
export class ThirdPartyNetworksFacebookMock {
  @Output() done: EventEmitter<any> = new EventEmitter(true);
}

@Component({
  selector: 'm-boost-console-network',
  template: '',
})
export class BoostConsoleNetworkListMock {
  @Input('type') type: BoostConsoleType;

  load(refresh?: boolean) {}
}

@Component({
  selector: 'm-boost-console-p2p',
  template: '',
})
export class BoostConsoleP2PListMock {
  @Input('filter') filter: BoostConsoleFilter;

  load(refresh?: boolean) {}
}

@Component({
  selector: 'm-boost-publisher',
  template: '',
})
export class BoostConsolePublisherMock {
  @Input() filter: BoostConsoleFilter;

  load(refresh?: boolean) {}

  toggle() {}
}

describe('BoostConsoleComponent', () => {
  let comp: BoostConsoleComponent;
  let fixture: ComponentFixture<BoostConsoleComponent>;

  function getBecomeAPublisher(): DebugElement {
    return fixture.debugElement.query(
      By.css('.m-boost-console--options-toggle > button')
    );
  }

  function getPointsCount(): DebugElement {
    return fixture.debugElement.query(
      By.css('.m-boost-console--overview-points-count > span')
    );
  }

  function getUSDCount(): DebugElement {
    return fixture.debugElement.query(
      By.css('.m-boost-console--overview-usd-count > span')
    );
  }

  function getPointEarnings(): DebugElement {
    return fixture.debugElement.query(
      By.css('.m-boost-console--overview-point-earnings > span')
    );
  }

  function getUSDEarnings(): DebugElement {
    return fixture.debugElement.query(
      By.css('.m-boost-console--overview-usd-earnings > span')
    );
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateSelectorComponentMock,
        TooltipComponentMock,
        BoostConsoleBoosterMock,
        ThirdPartyNetworksFacebookMock,
        BoostConsoleNetworkListMock,
        BoostConsoleP2PListMock,
        BoostConsolePublisherMock,
        BoostConsoleComponent,
      ],
      imports: [RouterTestingModule],
      providers: [
        { provide: Client, useValue: clientMock },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ type: 'newsfeed' }),
            snapshot: { params: { type: 'newsfeed' } },
          },
        },
        BoostService,
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(BoostConsoleComponent);
    comp = fixture.componentInstance;

    // Set up mock HTTP client
    clientMock.response = {};

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
    // reset jasmine clock after each test
    jasmine.clock().uninstall();
  });
});
