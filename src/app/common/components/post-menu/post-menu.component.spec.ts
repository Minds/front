///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  NO_ERRORS_SCHEMA,
} from '@angular/core';

import { Session } from '../../../services/session';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api/client';
import { SignupModalService } from '../../../modules/modals/signup/service';
import { By } from '@angular/platform-browser';
import { PostMenuComponent } from './post-menu.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { clientMock } from '../../../../tests/client-mock.spec';
import { sessionMock } from '../../../../tests/session-mock.spec';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BlockListService } from '../../services/block-list.service';
import { ActivityService } from '../../services/activity.service';
import { FeaturesService } from '../../../services/features.service';
import { activityServiceMock } from '../../../../tests/activity-service-mock.spec';
import { storageMock } from '../../../../tests/storage-mock.spec';
import { featuresServiceMock } from '../../../../tests/features-service-mock.spec';
/* tslint:disable */

/* Mock section */

@Component({
  selector: 'm-modal-share',
  template: '',
})
class ModalShareMock {
  @Input() open;
  @Input() url;
  @Input() embed;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'm-modal',
  template: '<ng-content></ng-content>',
})
class MindsModalMock {
  @Input() open: any;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'm-modal-report',
  template: '',
})
class ModalReportMock {
  @Input() open;
  @Input() object;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'm-modal-confirm',
  template: '',
})
class ModalConfirmMock {
  @Input() open;
  @Input() closeAfterAction;
  @Input() yesButton;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() actioned: EventEmitter<any> = new EventEmitter<any>();
}

let scrollServiceMock = new (function() {
  this.initOnScroll = jasmine.createSpy('initOnScroll').and.stub();
  this.open = jasmine.createSpy('open').and.stub();
  this.close = jasmine.createSpy('close').and.stub();
})();

/* ENd of mock section */
describe('PostMenuComponent', () => {
  let comp: PostMenuComponent;
  let fixture: ComponentFixture<PostMenuComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MindsModalMock,
        ModalShareMock,
        ModalConfirmMock,
        ModalReportMock,
        PostMenuComponent,
      ], // declare the test component
      imports: [RouterTestingModule, NgCommonModule, FormsModule],
      providers: [
        { provide: SignupModalService, useValue: scrollServiceMock },
        { provide: Client, useValue: clientMock },
        { provide: Session, useValue: sessionMock },
        { provide: OverlayModalService, useValue: overlayModalServiceMock },
        { provide: ActivityService, useValue: activityServiceMock },
        { provide: FeaturesService, useValue: featuresServiceMock },
        { provide: Storage, useValue: storageMock },
        {
          provide: BlockListService,
          useFactory: () => {
            return BlockListService._(clientMock, sessionMock, storageMock);
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    featuresServiceMock.mock('allow-comments-toggle', true);
    fixture = TestBed.createComponent(PostMenuComponent);

    comp = fixture.componentInstance;
    comp.options = [
      'edit',
      'translate',
      'share',
      'follow',
      'unfollow',
      'feature',
      'unfeature',
      'delete',
      'report',
      'block',
    ];
    comp.entity = {};
    // comp.opened = true;
    comp.entity.ownerObj = { guid: '1' };
    comp.cardMenuHandler();
    fixture.detectChanges();
  });

  it('should have dropdown', () => {
    expect(
      fixture.debugElement.query(By.css('.minds-dropdown-menu'))
    ).not.toBeNull();
  });

  it('should check if owner is blocked when opening dropdown', () => {
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/block/1');
  });

  it('should put to owner when blocking', () => {
    comp.block();
    fixture.detectChanges();
    expect(clientMock.put.calls.mostRecent().args[0]).toEqual('api/v1/block/1');
  });

  it('should delete to owner when unblocking', () => {
    comp.unBlock();
    fixture.detectChanges();
    expect(clientMock.delete.calls.mostRecent().args[0]).toEqual(
      'api/v1/block/1'
    );
  });

  it('should allow comments', () => {
    spyOn(comp.optionSelected, 'emit');
    comp.allowComments(true);
    expect(activityServiceMock.toggleAllowComments).toHaveBeenCalledWith(
      comp.entity,
      true
    );
    expect(comp.entity.allow_comments).toEqual(true);
  });

  it('should disable comments', () => {
    spyOn(comp.optionSelected, 'emit');

    comp.allowComments(false);
    expect(activityServiceMock.toggleAllowComments).toHaveBeenCalledWith(
      comp.entity,
      false
    );
    expect(comp.entity.allow_comments).toEqual(false);
  });
});
