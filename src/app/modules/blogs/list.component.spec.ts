import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { CommonModule } from '@angular/common';

import { By } from '@angular/platform-browser';
import { BlogListComponent } from './list.component';
import { Session } from '../../services/session';
import { Client } from '../../services/api/client';
import { clientMock } from '../../../tests/client-mock.spec';
import { ContextService } from '../../services/context.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { ActivatedRoute } from '@angular/router';
import { MockComponent, MockService } from '../../utils/mock';
import { overlayModalServiceMock } from '../../../tests/overlay-modal-service-mock.spec';
import { OverlayModalService } from '../../services/ux/overlay-modal';

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

describe('BlogListComponent', () => {
  let comp: BlogListComponent;
  let fixture: ComponentFixture<BlogListComponent>;

  function getNavigationItem(i: number): DebugElement {
    return fixture.debugElement.query(
      By.css(`.m-toolbar a.m-topbar--navigation--item:nth-child(${i})`)
    );
  }

  function getNavigationItemTooltip(i: number): DebugElement {
    return fixture.debugElement.query(
      By.css(
        `.m-toolbar a.m-topbar--navigation--item:nth-child(${i}) m-tooltip`
      )
    );
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
          inputs: ['icon'],
        }),
        MockComponent({
          selector: 'm-topbar--navigation--options',
          template: '',
          inputs: ['options'],
          outputs: ['change'],
        }),
        MockComponent({
          selector: 'm-blog--tile',
          template: '',
          inputs: ['entity'],
        }),
        MockComponent({
          selector: 'm-topbar--hashtags',
          template: '',
          outputs: ['selectionChange'],
          inputs: ['enabled'],
        }),
        BlogListComponent,
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
      ],
      providers: [
        { provide: Session, useValue: sessionMock },
        { provide: Client, useValue: clientMock },
        { provide: ContextService, useValue: MockService(ContextService) },
        {
          provide: ActivatedRoute,
          useValue: { params: of({ filter: 'trending' }) },
        },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    jasmine.clock().install();

    fixture = TestBed.createComponent(BlogListComponent);

    comp = fixture.componentInstance;
    comp.filter = 'trending';

    clientMock.response = {};
    clientMock.response['api/v2/entities/suggested/blogs'] = {
      status: 'success',
      entities: [
        {
          guid: '1',
          type: 'blog',
        },
        {
          guid: '2',
          type: 'blog',
        },
        {
          guid: '3',
          type: 'blog',
        },
        {
          guid: '4',
          type: 'blog',
        },
      ],
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

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have loaded the blogs', () => {
    expect(clientMock.get).toHaveBeenCalled();
    expect(clientMock.get.calls.mostRecent().args[0]).toBe(
      'api/v2/entities/suggested/blogs'
    );
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

    const options = fixture.debugElement.query(
      By.css('.m-toolbar m-topbar--navigation--options')
    );

    expect(nav1).not.toBeNull();
    expect(nav1.nativeElement.children[0].textContent).toContain('Top');
    expect(tooltip1).not.toBeNull();
    expect(tooltip1.nativeElement.textContent).toContain(
      'Top displays the top content on Minds'
    );

    expect(nav2).not.toBeNull();
    expect(nav2.nativeElement.children[0].textContent).toContain(
      'Subscriptions'
    );
    expect(tooltip2).not.toBeNull();
    expect(tooltip2.nativeElement.textContent).toContain(
      'Blogs from channels you are subscribed to'
    );

    expect(nav3).not.toBeNull();
    expect(nav3.nativeElement.children[0].textContent).toContain('My Blogs');
    expect(tooltip3).not.toBeNull();
    expect(tooltip3.nativeElement.textContent).toContain('Your blogs');

    expect(nav4).not.toBeNull();
    expect(nav4.nativeElement.children[0].textContent).toContain(
      'Write a new blog'
    );
    expect(tooltip4).not.toBeNull();
    expect(tooltip4.nativeElement.textContent).toContain('Write a new Blog');

    expect(options).not.toBeNull();
  });

  it('should have a list of blogs in two columns', () => {
    expect(fixture.debugElement.query(By.css('.m-blog--list'))).not.toBeNull();
    const column1 = fixture.debugElement.query(
      By.css('.m-blog--list > .m-blog--list--column-0')
    );
    const column2 = fixture.debugElement.query(
      By.css('.m-blog--list > .m-blog--list--column-1')
    );
    expect(column1).not.toBeNull();
    expect(column1.nativeElement.children.length).toBe(2);
    expect(column2).not.toBeNull();
    expect(column2.nativeElement.children.length).toBe(2);
  });

  it('should have an infinite-scroll', () => {
    expect(
      fixture.debugElement.query(By.css('infinite-scroll'))
    ).not.toBeNull();
  });
});
