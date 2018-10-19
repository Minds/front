import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { ChannelsListComponent } from './list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { Session } from '../../services/session';
import { sessionMock } from '../../../tests/session-mock.spec';
import { clientMock } from '../../../tests/client-mock.spec';
import { mindsTitleMock } from '../../mocks/services/ux/minds-title.service.mock.spec';
import { MindsTitle } from '../../services/ux/title';
import { contextServiceMock } from '../../../tests/context-service-mock.spec';
import { ContextService } from '../../services/context.service';
import { Client } from '../../services/api/client';
import { MockComponent } from '../../utils/mock';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { overlayModalServiceMock } from '../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../services/ux/overlay-modal';

describe('ChannelsListComponent', () => {

  let comp: ChannelsListComponent;
  let fixture: ComponentFixture<ChannelsListComponent>;

  function getNavigationItem(i: number): DebugElement {
    return fixture.debugElement.query(By.css(`.m-toolbar a.m-topbar--navigation--item:nth-child(${i})`));
  }

  function getNavigationItemTooltip(i: number): DebugElement {
    return fixture.debugElement.query(By.css(`.m-toolbar a.m-topbar--navigation--item:nth-child(${i}) m-tooltip`));
  }

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MockComponent({
          selector: 'infinite-scroll',
          inputs: ['inProgress', 'moreData', 'inProgress'],
        }),
        MockComponent({
          selector: 'm-tooltip',
          template: '<ng-content></ng-content>',
          inputs: ['icon']
        }),
        MockComponent({
          selector: 'm-channels--tile',
          template: '',
          inputs: ['entity']
        }),
        MockComponent({
          selector: 'm-topbar--hashtags',
          template: '',
          inputs: ['enabled'],
          outputs: ['selectionChange']
        }),
        ChannelsListComponent
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: MindsTitle, useValue: mindsTitleMock },
        { provide: ContextService, useValue: contextServiceMock },
        { provide: ActivatedRoute, useValue: { params: of('all') } },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
      ]
    })
      .compileComponents();
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    fixture = TestBed.createComponent(ChannelsListComponent);

    comp = fixture.componentInstance;

    clientMock.response = {};
    clientMock.response['api/v1/entities/trending/channels'] = {
      status: 'success',
      entities: [
        {
          guid: 123,
          name: 'test1'
        },
        {
          guid: 456,
          name: 'test2'
        },
      ]
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

  it('should have a topbar', () => {
    expect(fixture.debugElement.query(By.css('.m-toolbar'))).not.toBeNull();
    const nav1 = getNavigationItem(1);
    const tooltip1 = getNavigationItemTooltip(1);
    const nav2 = getNavigationItem(2);
    const tooltip2 = getNavigationItemTooltip(2);
    const nav3 = getNavigationItem(3);
    const tooltip3 = getNavigationItemTooltip(3);
    const nav4 = getNavigationItem(4);
    const tooltip4 = getNavigationItemTooltip(4);

    expect(nav1).not.toBeNull();
    expect(nav1.nativeElement.children[0].textContent).toContain('Top');
    expect(tooltip1).not.toBeNull();
    expect(tooltip1.nativeElement.textContent).toContain('Top displays the top content on Minds');

    expect(nav2).not.toBeNull();
    expect(nav2.nativeElement.children[0].textContent).toContain('Subscriptions');
    expect(tooltip2).not.toBeNull();
    expect(tooltip2.nativeElement.textContent).toContain('Channels you are subscribed to');

    expect(nav3).not.toBeNull();
    expect(nav3.nativeElement.children[0].textContent).toContain('Subscribers');
    expect(tooltip3).not.toBeNull();
    expect(tooltip3.nativeElement.textContent).toContain('Channels who are subscribed to you');

    expect(nav4).not.toBeNull();
    expect(nav4.nativeElement.children[0].textContent).toContain('Founders');
    expect(tooltip4).not.toBeNull();
    expect(tooltip4.nativeElement.textContent).toContain('Channels who invested in the Minds Reg-CF Crowfunding campaign');
  });

  it('should have a list of channels', () => {
    const tiles = fixture.debugElement.queryAll(By.css('.m-channels--list m-channels--tile'));

    expect(tiles).not.toBeNull();
    expect(tiles.length).toBe(2);
  });

  it('should have an infinite-scroll', () => {
    expect(fixture.debugElement.query(By.css('infinite-scroll'))).not.toBeNull();
  });

});
