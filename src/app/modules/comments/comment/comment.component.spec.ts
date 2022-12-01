import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AttachmentService } from '../../../services/attachment';
import { Session } from '../../../services/session';
import { Client } from '../../../services/api';
import { TranslationService } from '../../../services/translation';
import { UserAvatarService } from '../../../common/services/user-avatar.service';
import { ModalService } from '../../../services/ux/modal.service';
import {
  ChangeDetectorRef,
  ElementRef,
  Injector,
  PLATFORM_ID,
} from '@angular/core';
import { TimeDiffService } from '../../../services/timediff.service';
import { Router } from '@angular/router';
import { ActivityService } from '../../../common/services/activity.service';
import { FeaturesService } from '../../../services/features.service';
import { ConfigsService } from '../../../common/services/configs.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { ActivityModalCreatorService } from '../../newsfeed/activity/modal/modal-creator.service';
import { AutocompleteSuggestionsService } from '../../suggestions/services/autocomplete-suggestions.service';
import { CommentComponentV2 } from './comment.component';
import { MockComponent, MockService } from '../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { CodeHighlightPipe } from '../../code-highlight/code-highlight.pipe';
import { CodeHighlightService } from '../../code-highlight/code-highlight.service';
import { TagsPipeMock } from '../../../mocks/pipes/tagsPipe.mock';
import { TruncatePipe } from '../../../common/pipes/truncate.pipe';

describe('CommentComponentV2', () => {
  let comp: CommentComponentV2;
  let fixture: ComponentFixture<CommentComponentV2>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          CommentComponentV2,
          TagsPipeMock,
          CodeHighlightPipe,
          TruncatePipe,
          MockComponent({
            selector: 'm-translate',
            inputs: ['open', 'entity'],
          }),
          MockComponent({
            selector: 'm-hovercard',
            inputs: ['publisher', 'offset'],
          }),
          MockComponent({
            selector: 'minds-button-thumbs-up',
            inputs: ['object'],
          }),
          MockComponent({
            selector: 'minds-button-thumbs-down',
            inputs: ['object'],
          }),
          MockComponent({
            selector: 'm-relativeTimeSpan',
            inputs: ['entity'],
          }),
          MockComponent({
            selector: 'm-channel--badges',
            inputs: ['user'],
          }),
          MockComponent({
            selector: 'm-read-more--button',
            inputs: ['v2'],
          }),
          MockComponent({
            selector: 'm-dropdownMenu',
            inputs: ['menu', 'anchorPosition'],
          }),
          MockComponent({
            selector: 'a',
            inputs: ['routerLink'],
          }),
          MockComponent({
            selector: 'div',
            inputs: ['maxHeightAllowed'],
          }),
        ],
        providers: [
          {
            provide: CodeHighlightService,
            useValue: MockService(CodeHighlightService),
          },
          {
            provide: Session,
            useValue: MockService(Session),
          },
          {
            provide: Client,
            useValue: MockService(Client),
          },
          {
            provide: TranslationService,
            useValue: MockService(TranslationService),
          },
          {
            provide: UserAvatarService,
            useValue: MockService(UserAvatarService),
          },
          {
            provide: ModalService,
            useValue: MockService(ModalService),
          },
          {
            provide: ChangeDetectorRef,
            useValue: MockService(ChangeDetectorRef),
          },
          {
            provide: TimeDiffService,
            useValue: MockService(TimeDiffService, {
              has: ['source'],
              props: {
                source: {
                  get: () => new BehaviorSubject<any>(0),
                },
              },
            }),
          },
          {
            provide: ElementRef,
            useValue: MockService(ElementRef),
          },
          {
            provide: Router,
            useValue: MockService(Router),
          },
          {
            provide: ActivityService,
            useValue: MockService(ActivityService),
          },
          {
            provide: FeaturesService,
            useValue: MockService(FeaturesService),
          },
          {
            provide: PLATFORM_ID,
            useValue: 'browser',
          },
          {
            provide: ConfigsService,
            useValue: MockService(ConfigsService),
          },
          {
            provide: ToasterService,
            useValue: MockService(ToasterService),
          },
          {
            provide: ActivityModalCreatorService,
            useValue: MockService(ActivityModalCreatorService),
          },
          {
            provide: Injector,
            useValue: MockService(Injector),
          },
          {
            provide: AutocompleteSuggestionsService,
            useValue: MockService(AutocompleteSuggestionsService),
          },
        ],
      })
        .overrideProvider(AttachmentService, {
          useValue: MockService(AttachmentService),
        })
        .compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(CommentComponentV2);
    comp = fixture.componentInstance;

    comp.comment = {
      guid: '123',
      time_created: 1,
      ownerObj: {
        guid: '321',
        icontime: '999999',
      },
    };

    (comp as any).session.getLoggedInUser.and.returnValue({
      guid: '123',
    });

    comp.shouldOpenModal = true;
    (comp as any).cdnUrl = 'http://locahost';

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });

  it('should call to open modal when shouldOpenModal is true', () => {
    comp.shouldOpenModal = true;
    comp.openModal();
    expect((comp as any).activityModalCreator.create).toHaveBeenCalled();
  });

  it('should NOT call to open modal when shouldOpenModal is false', () => {
    comp.shouldOpenModal = false;
    comp.openModal();
    expect((comp as any).activityModalCreator.create).not.toHaveBeenCalled();
  });
});
