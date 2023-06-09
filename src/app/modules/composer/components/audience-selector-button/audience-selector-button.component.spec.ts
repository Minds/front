import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ComposerAudienceSelectorButtonComponent } from './audience-selector-button.component';
import {
  ActivityContainer,
  ComposerAudienceSelectorService,
} from '../../services/audience.service';
import { ComposerService } from '../../services/composer.service';
import { BehaviorSubject, of } from 'rxjs';
import { PopupService } from '../popup/popup.service';
import { MockService } from '../../../../utils/mock';
import { Session } from '../../../../services/session';
import { TruncatePipe } from '../../../../common/pipes/truncate.pipe';
import { ActivityEntity } from '../../../newsfeed/activity/activity.service';
import { SupermindComposerPayloadType } from '../popup/supermind/superminds-creation.service';
import { SUPERMIND_RESPONSE_TYPES } from '../popup/supermind/superminds-creation.service';
import { ComposerAudienceSelectorPanelComponent } from '../popup/audience-selector/audience-selector.component';

describe('ComposerAudienceSelectorButtonComponent', () => {
  let comp: ComposerAudienceSelectorButtonComponent;
  let fixture: ComponentFixture<ComposerAudienceSelectorButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComposerAudienceSelectorButtonComponent, TruncatePipe],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        {
          provide: ComposerAudienceSelectorService,
          useValue: MockService(ComposerAudienceSelectorService, {
            has: ['selectedAudience$'],
            props: {
              selectedAudience$: {
                get: () => new BehaviorSubject<ActivityContainer>(null),
              },
            },
          }),
        },
        { provide: PopupService, useValue: MockService(PopupService) },
        {
          provide: ComposerService,
          useValue: MockService(ComposerService, {
            has: [
              'supermindRequest$',
              'isSupermindRequest$',
              'isGroupPost$',
              'remind$',
            ],
            props: {
              isSupermindRequest$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              isGroupPost$: { get: () => new BehaviorSubject<boolean>(false) },
              remind$: { get: () => new BehaviorSubject<ActivityEntity>(null) },
              supermindRequest$: {
                get: () =>
                  new BehaviorSubject<SupermindComposerPayloadType>(null),
              },
            },
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ComposerAudienceSelectorButtonComponent);
    comp = fixture.componentInstance;
  });

  afterEach(() => {
    (comp as any).audienceSelectorService.selectedAudience$.next(null);
    (comp as any).composerService.supermindRequest$.next(null);
    (comp as any).composerService.isSupermindRequest$.next(false);
    (comp as any).composerService.isGroupPost$.next(false);
    (comp as any).composerService.remind$.next(null);
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should initialize with a false disabled state when appropriate', fakeAsync(() => {
    comp.ngOnDestroy();
    (comp as any).audienceSelectorService.selectedAudience$.next(null);
    (comp as any).composerService.supermindRequest$.next(null);
    (comp as any).composerService.isSupermindRequest$.next(false);
    (comp as any).composerService.isGroupPost$.next(false);
    (comp as any).composerService.remind$.next(null);

    comp.ngOnInit();
    tick();

    expect(comp.disabled).toBe(false);
  }));

  it('should initialize with a true disabled state post is a remind', fakeAsync(() => {
    comp.ngOnDestroy();
    (comp as any).audienceSelectorService.selectedAudience$.next(null);
    (comp as any).composerService.supermindRequest$.next(null);
    (comp as any).composerService.isSupermindRequest$.next(false);
    (comp as any).composerService.isGroupPost$.next(false);
    (comp as any).composerService.remind$.next(true);

    comp.ngOnInit();
    tick();

    expect(comp.disabled).toBe(true);
  }));

  it('should initialize with a true disabled state post is a group post', fakeAsync(() => {
    comp.ngOnDestroy();
    (comp as any).audienceSelectorService.selectedAudience$.next(null);
    (comp as any).composerService.supermindRequest$.next(null);
    (comp as any).composerService.isSupermindRequest$.next(false);
    (comp as any).composerService.isGroupPost$.next(true);
    (comp as any).composerService.remind$.next(false);

    comp.ngOnInit();
    tick();

    expect(comp.disabled).toBe(true);
  }));

  it('should initialize with a true disabled state post is a Supermind request and reset audience', fakeAsync(() => {
    comp.ngOnDestroy();
    (comp as any).audienceSelectorService.selectedAudience$.next('My Group');
    (comp as any).composerService.supermindRequest$.next({
      receiver_user: { guid: 123 },
      receiver_guid: '123',
      reply_type: SUPERMIND_RESPONSE_TYPES.TEXT,
      twitter_required: false,
      payment_options: null,
      terms_agreed: true,
      refund_policy_agreed: true,
    });
    (comp as any).composerService.isSupermindRequest$.next(true);
    (comp as any).composerService.isGroupPost$.next(false);
    (comp as any).composerService.remind$.next(null);

    comp.ngOnInit();
    tick();

    expect(comp.disabled).toBe(true);
    expect(
      (comp as any).audienceSelectorService.selectedAudience$.getValue()
    ).toBe(null);
  }));

  it('should create popup on click when not disabled', fakeAsync(() => {
    (comp as any).popup.create.and.returnValue((comp as any).popup);
    (comp as any).popup.present.and.returnValue(of(true));

    comp.disabled = false;

    comp.onClick();
    tick();

    expect((comp as any).popup.create).toHaveBeenCalledWith(
      ComposerAudienceSelectorPanelComponent
    );
  }));

  it('should NOT create popup on click when disabled', fakeAsync(() => {
    comp.disabled = true;

    comp.onClick();
    tick();

    expect((comp as any).popup.create).not.toHaveBeenCalled();
  }));
});
