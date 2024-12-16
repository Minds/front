///<reference path="../../../../node_modules/@types/jasmine/index.d.ts"/>
import {
  waitForAsync,
  ComponentFixture,
  TestBed,
  fakeAsync,
} from '@angular/core/testing';

import { Client } from '../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../tests/client-mock.spec';
import { NotificationsFlyoutComponent } from './flyout.component';

import { MockComponent, MockDirective } from '../../utils/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationStart, Router } from '@angular/router';

describe('NotificationsFlyoutComponent', () => {
  let comp: NotificationsFlyoutComponent;
  let fixture: ComponentFixture<NotificationsFlyoutComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockDirective({
          selector: '[mdl]',
          inputs: ['mdl'],
        }),
        MockComponent(
          {
            selector: 'minds-notifications',
            inputs: [
              'loadOnDemand',
              'hidden',
              'visible',
              'useOwnScrollSource',
              'showTabs',
              'showShadows',
              'showInfiniteScroll',
              'showElapsedTime',
            ],
          },
          ['onVisible']
        ),
        NotificationsFlyoutComponent,
      ],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: Client,
          useValue: clientMock,
        },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(NotificationsFlyoutComponent);
    clientMock.response = {};

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
    jasmine.clock().uninstall();
  });

  // it('Should use the onvisible method', () => {
  //   const notifications = fixture.debugElement.query(
  //     By.css('minds-notifications')
  //   );
  //   expect(notifications).not.toBeNull();
  // });

  it('Should emit close evt', () => {
    spyOn(comp.closeEvt, 'emit').and.callThrough();
    comp.close();

    expect(comp.closeEvt.emit).toHaveBeenCalled();
  });

  // it('Should call onVisible', () => {
  //   comp.toggleLoad();
  //   expect(comp.notificationList.onVisible).toHaveBeenCalled();
  // });

  // it('Should subscribe to router', () => {
  //   spyOn(comp.closeEvt, 'emit').and.callThrough();
  //   comp.visible = true;
  //   // push fake router event
  //   const event = new NavigationStart(1, '/');
  //   TestBed.inject(Router).events.next(event);

  //   expect(comp.closeEvt.emit).toHaveBeenCalled();
  // });
});
