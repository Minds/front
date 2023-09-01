import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivityDisplayOptions,
  ActivityService,
} from '../../activity/activity.service';
import { Session } from '../../../../services/session';
import { MockComponent, MockService } from '../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ActivityOwnerBlockComponent } from './owner-block.component';
import userMock from '../../../../mocks/responses/user.mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('ActivityOwnerBlockComponent', () => {
  let comp: ActivityOwnerBlockComponent;
  let fixture: ComponentFixture<ActivityOwnerBlockComponent>;

  let mockEntity: any = {
    guid: 213,
    ownerObj: userMock,
  };

  let mockDisplayOptions: Partial<ActivityDisplayOptions> = {
    isFeed: true,
    isModal: false,
    isSidebarBoost: false,
    isSingle: false,
    showPostMenu: true,
    minimalMode: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        ActivityOwnerBlockComponent,
        MockComponent({
          selector: 'm-activity__avatar',
          inputs: ['entity', 'wasQuoted'],
        }),
        MockComponent({
          selector: 'm-activity__badges',
        }),
        MockComponent({
          selector: 'm-activity__views',
        }),
        MockComponent({
          selector: 'm-activity__menu',
          outputs: ['deleted'],
        }),
        MockComponent({
          selector: 'm-activity__permalink',
          inputs: ['wasQuoted'],
        }),
        MockComponent({
          selector: 'm-subscribeButton',
          inputs: ['user', 'sized', 'displayAsButton', 'labelType'],
        }),
        MockComponent({
          selector: 'm-group__membershipButton',
          inputs: ['group', 'displayAsButton', 'labelType'],
        }),
        MockComponent({
          selector: 'm-channel--badges',
          inputs: ['user'],
        }),
      ],
      providers: [
        {
          provide: ActivityService,
          useValue: MockService(ActivityService, {
            has: ['entity$', 'isRemind$', 'showGroupContext$'],
            props: {
              entity$: {
                get: () => new BehaviorSubject<any>(mockEntity),
              },
              isRemind$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              showGroupContext$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              displayOptions: mockDisplayOptions,
            },
          }),
        },
        { provide: Session, useValue: MockService(Session) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityOwnerBlockComponent);
    comp = fixture.componentInstance;

    (comp as any).wasQuoted = false;

    (comp as any).service.displayOptions = mockDisplayOptions;
    (comp as any).service.entity$.next(mockEntity);

    (comp as any).session.getLoggedInUser.and.returnValue(userMock);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('permalink', () => {
    it('should show permalink when appropriate', () => {
      comp.showPermalink = false;

      (comp as any).service.displayOptions.isSingle = false;
      (comp as any).service.displayOptions.isModal = false;
      (comp as any).service.displayOptions.minimalMode = false;
      (comp as any).wasQuoted = false;

      comp.ngOnInit();

      expect(comp.showPermalink).toBe(true);
    });

    it('should show permalink when on single page and AND the block is in a quote', () => {
      comp.showPermalink = false;

      (comp as any).service.displayOptions.isSingle = true;
      (comp as any).service.displayOptions.isModal = false;
      (comp as any).service.displayOptions.minimalMode = false;
      (comp as any).wasQuoted = true;

      comp.ngOnInit();

      expect(comp.showPermalink).toBe(true);
    });

    it('should NOT show permalink when on single page and the block is in a quote', () => {
      comp.showPermalink = true;

      (comp as any).service.displayOptions.isSingle = true;
      (comp as any).service.displayOptions.isModal = false;
      (comp as any).service.displayOptions.minimalMode = false;
      (comp as any).wasQuoted = false;

      comp.ngOnInit();

      expect(comp.showPermalink).toBe(false);
    });

    it('should NOT show permalink when in a modal', () => {
      comp.showPermalink = true;

      (comp as any).service.displayOptions.isSingle = false;
      (comp as any).service.displayOptions.isModal = true;
      (comp as any).service.displayOptions.minimalMode = false;
      (comp as any).wasQuoted = false;

      comp.ngOnInit();

      expect(comp.showPermalink).toBe(false);
    });

    it('should NOT show permalink when NOT in minimal mode', () => {
      comp.showPermalink = true;

      (comp as any).service.displayOptions.isSingle = false;
      (comp as any).service.displayOptions.isModal = false;
      (comp as any).service.displayOptions.minimalMode = true;
      (comp as any).wasQuoted = false;

      comp.ngOnInit();

      expect(comp.showPermalink).toBe(false);
    });
  });
});
