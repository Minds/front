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

import { AdminBoosts } from './boosts';
import { FormsModule } from '@angular/forms';
import { Client } from '../../../services/api/client';
import { By } from '@angular/platform-browser';
import { clientMock } from '../../../../tests/client-mock.spec';
import { MaterialMock } from '../../../../tests/material-mock.spec';
import { MaterialSliderMock } from '../../../../tests/material-slider.mock.spec';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenPipe } from '../../../common/pipes/token.pipe';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { ActivityService } from '../../../common/services/activity.service';
import { activityServiceMock } from '../../../../tests/activity-service-mock.spec';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';

@Component({
  selector: 'minds-card-video',
  template: '',
})
class MindsCardVideoMock {
  @Input() object: any;
}

@Component({
  selector: 'minds-card-image',
  template: '',
})
class MindsCardImageMock {
  @Input() object: any;
}

@Component({
  selector: 'minds-card-blog',
  template: '',
})
class MindsCardBlogMock {
  @Input() object: any;
}

@Component({
  selector: 'minds-card-user',
  template: '',
})
class MindsCardUserMock {
  @Input() object: any;
}

@Component({
  selector: 'minds-activity',
  template: '',
})
class MindsActivityMock {
  @Input() object: any;
}

@Component({
  selector: 'minds-card-group',
  template: '',
})
class MindsCardGroupMock {
  @Input() group: any;
}

@Component({
  selector: 'm--rejection-reason-modal',
  template: '',
})
class RejectionReasonModalMock {
  @Input() boost: any;
  @Input() closeAfterAction: boolean;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() actioned: EventEmitter<any> = new EventEmitter<any>();
  @Input() yesButton: string;
  @Input() noButton: string;
}

describe('AdminBoosts', () => {
  let comp: AdminBoosts;
  let fixture: ComponentFixture<AdminBoosts>;

  function getTabItems(i: number): DebugElement {
    return fixture.debugElement.query(
      By.css(`.mdl-tabs__tab-bar .mdl-tabs__tab:nth-child(${i})`)
    );
  }

  function getBoost(i: number): DebugElement {
    return fixture.debugElement.query(By.css(`.boost`));
  }

  function getAcceptButton(): DebugElement {
    return fixture.debugElement.query(
      By.css('.boost .m-admin-boosts--accept-button')
    );
  }

  function getOpenButton(): DebugElement {
    return fixture.debugElement.query(
      By.css('.boost .m-admin-boosts--open-button')
    );
  }

  function getRejectButton(): DebugElement {
    return fixture.debugElement.query(
      By.css('.boost .m-admin-boosts--reject-button')
    );
  }

  function getETagButton(): DebugElement {
    return fixture.debugElement.query(
      By.css('.boost .m-admin-boosts--e-tag-button')
    );
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TokenPipe,
        MindsCardVideoMock,
        MindsCardImageMock,
        MindsCardBlogMock,
        MindsCardUserMock,
        MindsActivityMock,
        MindsCardGroupMock,
        RejectionReasonModalMock,
        MaterialMock,
        MaterialSliderMock,
        AdminBoosts,
      ], // declare the test component
      imports: [RouterTestingModule, NgCommonModule, FormsModule],
      providers: [
        { provide: Client, useValue: clientMock },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        { provide: ActivityService, useValue: activityServiceMock },
      ],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();

    fixture = TestBed.createComponent(AdminBoosts);

    comp = fixture.componentInstance; // AdminBoosts test instance

    clientMock.response = [];

    clientMock.response[`api/v1/admin/boosts/newsfeed`] = {
      status: 'success',
      boosts: [
        {
          guid: '123',
          _id: '59ba98d3b13628293d705ff2',
          entity: {
            guid: '752893213072691218',
            type: 'activity',
            time_created: '1504879730',
            time_updated: '1504879730',
            container_guid: '732337264197111809',
            owner_guid: '732337264197111809',
            access_id: '2',
            message: '',
            ownerObj: {
              guid: '732337264197111809',
              type: 'user',
              access_id: '2',
              name: 'minds',
              username: 'minds',
              mature: '0',
              boost_rating: '1',
            },
          },
          bid: '100',
          bidType: 'points',
          owner: {
            guid: '732337264197111809',
            type: 'user',
            subtype: false,
            time_created: '1499978809',
            time_updated: false,
            container_guid: '0',
            name: 'minds',
            username: 'minds',
            boost_rating: '1',
          },
          state: 'created',
          transactionId: null,
          time_created: '1505401043',
          last_updated: '1505401043',
          type: 'boost',
          subtype: 'network',
          handler: 'newsfeed',
          rating: null,
          quality: '75',
          impressions: '100',
          rejection_reason: '-1',
          boost_impressions: null,
          boost_id: null,
        },
      ],
      count: 4,
      'load-next': null,
      newsfeed_count: 4,
      content_count: 2,
    };
    clientMock.response[`api/v1/admin/boosts/analytics/newsfeed`] = {
      status: 'success',
      reviewQueue: 4,
      backlog: 2,
      priorityBacklog: 2,
      impressions: 5000,
      avgApprovalTime: 1889603500,
      avgImpressions: 2500,
      timestamp: 1505745685,
    };

    comp.type = 'newsfeed';

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

  it('should have a tab bar with Newsfeed and Content items', () => {
    const newsfeed: DebugElement = getTabItems(1);
    const content: DebugElement = getTabItems(2);

    expect(newsfeed).not.toBeNull();
    expect(newsfeed.nativeElement.textContent).toContain('Newsfeed');

    expect(content).not.toBeNull();
    expect(content.nativeElement.textContent).toContain('Content');
  });

  it('should have a statistics section', () => {
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-admin-boosts-statistics'))
    ).not.toBeNull();
  });

  it('should have a boosts container', () => {
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.m-admin-boosts-container'))
    ).not.toBeNull();
  });

  it('should show 1 boost', fakeAsync(() => {
    fixture.detectChanges();

    const boost = getBoost(1);

    expect(boost).not.toBeNull();
  }));

  it('should have a quality slider with a default value of 75', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    expect(
      fixture.debugElement.query(By.css('.boost > .quality-slider'))
    ).not.toBeNull();

    const slider: DebugElement = fixture.debugElement.query(
      By.css('.quality-slider input[type=range]')
    );
    expect(slider).not.toBeNull();
    expect(slider.nativeElement.value).toBe('75');
  }));

  it('should have a quality input with a default value of 75', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    const input: DebugElement = fixture.debugElement.query(
      By.css('.quality-slider input[type=number]')
    );
    expect(input).not.toBeNull();

    expect(input.nativeElement.value).toBe('75');
  }));

  it('boost should have an Accept button', () => {
    fixture.detectChanges();

    expect(getAcceptButton()).not.toBeNull();
  });

  it('accept button should call accept(...) with false as a second parameter (nsfw)', () => {
    fixture.detectChanges();

    const button: DebugElement = getAcceptButton();

    spyOn(comp, 'accept').and.stub();

    button.nativeElement.click();
    fixture.detectChanges();

    expect(comp.accept).toHaveBeenCalled();
    //expect(comp.accept.calls.mostRecent().args[1]).toBe(false);
  });

  it('boost should have an Open button', () => {
    fixture.detectChanges();

    expect(getOpenButton()).not.toBeNull();
  });

  it('Open button should call accept(...) with true as a second parameter (nsfw)', () => {
    fixture.detectChanges();

    const button: DebugElement = getOpenButton();

    spyOn(comp, 'accept').and.stub();

    button.nativeElement.click();
    fixture.detectChanges();

    expect(comp.accept).toHaveBeenCalled();
    //expect(comp.accept.calls.mostRecent().args[1]).toBe(true);
  });

  it('boost should have an Reject button', () => {
    fixture.detectChanges();

    expect(getRejectButton()).not.toBeNull();
  });

  it('Reject button should call openReasonsModal(...)', () => {
    fixture.detectChanges();

    const button: DebugElement = getRejectButton();

    spyOn(comp, 'openReasonsModal').and.stub();

    button.nativeElement.click();
    fixture.detectChanges();

    expect(comp.openReasonsModal).toHaveBeenCalled();
  });

  it('boost should have an e-tag button', () => {
    fixture.detectChanges();

    expect(getETagButton()).not.toBeNull();
  });

  it('Reject button should call eTag(...) and boost should be marked as explicit', () => {
    fixture.detectChanges();

    const button: DebugElement = getETagButton();

    spyOn(comp, 'eTag').and.callThrough();
    spyOn(comp, 'reject').and.stub();

    comp.boosts[0].rejection_reason = 2;

    button.nativeElement.click();
    fixture.detectChanges();

    expect(comp.eTag).toHaveBeenCalled();
    expect(comp.reject).toHaveBeenCalled();
    expect(comp.findReason(comp.boosts[0].rejection_reason).label).toContain(
      'Explicit'
    );
  });

  it('calling reject(boost) should call api/v1/admin/boosts/:type/:guid/reject together with the rejection reason', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    clientMock.post.calls.reset();

    comp.boosts[0].rejection_reason = 2;
    comp.reject(comp.boosts[0]);

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(
      'api/v1/admin/boosts/newsfeed/123/reject'
    );
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({ reason: 2 });
  }));

  it('calling accept(boost, false) should call api/v1/admin/boosts/:type/:guid/accept with a rating of 1 and a default quality of 75', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    clientMock.post.calls.reset();

    comp.accept(comp.boosts[0], false);

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(
      'api/v1/admin/boosts/newsfeed/123/accept'
    );
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      quality: '75',
      rating: 1,
      mature: 0,
    });
  }));

  it('calling accept(boost, true) should call api/v1/admin/boosts/:type/:guid/accept with a rating of 2 and a default quality of 75', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    clientMock.post.calls.reset();

    comp.accept(comp.boosts[0], true);

    expect(clientMock.post).toHaveBeenCalled();
    expect(clientMock.post.calls.mostRecent().args[0]).toContain(
      'api/v1/admin/boosts/newsfeed/123/accept'
    );
    expect(clientMock.post.calls.mostRecent().args[1]).toEqual({
      quality: '75',
      rating: 2,
      mature: 0,
    });
  }));
});
