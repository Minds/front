///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  BoostConsoleComponent,
  BoostConsoleFilter,
  BoostConsoleType,
} from './console.component';
import { TooltipComponentMock } from '../../../mocks/common/components/tooltip/tooltip.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MockService } from '../../../utils/mock';
import { MetaService } from '../../../common/services/meta.service';

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

  beforeEach(
    waitForAsync(() => {
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
          {
            provide: ActivatedRoute,
            useValue: {
              firstChild: {
                url: of([{ path: 'newsfeed' }]),
              },
            },
          },
          { provide: MetaService, useValue: MockService(MetaService) },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(BoostConsoleComponent);
    comp = fixture.componentInstance;

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

  it('should create', () => {
    expect(comp).toBeTruthy();
  });
});
