import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent, MockService } from '../../../../utils/mock';
import { ToolbarComponent } from './toolbar.component';
import { ComposerService, ComposerSize } from '../../services/composer.service';
import { PopupService } from '../popup/popup.service';
import { NsfwComponent } from '../popup/nsfw/nsfw.component';
import { ComposerMonetizeV2Component } from '../popup/monetize/v2/components/monetize.component';
import { TagsComponent } from '../popup/tags/tags.component';
import { ScheduleComponent } from '../popup/schedule/schedule.component';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ButtonComponent } from '../../../../common/components/button/button.component';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { UploaderService } from '../../services/uploader.service';
import { AttachmentApiService } from '../../../../common/api/attachment-api.service';
import { ComposerSupermindComponent } from '../popup/supermind/supermind.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExperimentsService } from '../../../experiments/experiments.service';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { NsfwEnabledService } from '../../../multi-tenant-network/services/nsfw-enabled.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { By } from '@angular/platform-browser';
import { IfTenantDirective } from '../../../../common/directives/if-tenant.directive';
import { IsTenantService } from '../../../../common/services/is-tenant.service';
import { SiteMembershipsCountService } from '../../../site-memberships/services/site-membership-count.service';
import { ComposerBoostService } from '../../services/boost.service';
import { PermissionIntentsService } from '../../../../common/services/permission-intents.service';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';

describe('Composer Toolbar', () => {
  let comp: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  const attachment$ = jasmine.createSpyObj('attachment$', {
    next: () => {},
    subscribe: { unsubscribe: () => {} },
  });

  const attachmentError$ = new BehaviorSubject<any>(null);

  const isEditing$ = jasmine.createSpyObj('isEditing$', {
    next: () => {},
    getValue: () => false,
    subscribe: { unsubscribe: () => {} },
  });

  const monetization$ = jasmine.createSpyObj('monetization$', {
    next: () => {},
    getValue: () => null,
    subscribe: { unsubscribe: () => {} },
  });

  const size$ = new BehaviorSubject<ComposerSize>('full');
  const remind$ = new BehaviorSubject(null);
  const canCreateSupermindRequest$ = new BehaviorSubject(true);
  const isGroupPost$ = new BehaviorSubject<boolean>(false);
  const canPost$ = new BehaviorSubject<boolean>(true);
  const inProgress$ = new BehaviorSubject<boolean>(false);
  const isPosting$ = new BehaviorSubject<boolean>(false);
  const siteMembershipGuids$ = new BehaviorSubject(null);
  const postButtonDisabled$ = new BehaviorSubject<boolean>(false);
  const nextButtonDisabled$ = new BehaviorSubject<boolean>(false);

  const siteMembershipCount$ = new BehaviorSubject<number>(0);

  const composerServiceMock: any = MockService(ComposerService, {
    has: [
      'attachment$',
      'isEditing$',
      'monetization$',
      'size$',
      'attachmentError$',
      'remind$',
      'canCreateSupermindRequest$',
      'isSupermindRequest$',
      'supermindRequest$',
      'isSupermindReply$',
      'supermindReply$',
      'isGroupPost$',
      'canPost$',
      'inProgress$',
      'isPosting$',
      'siteMembershipGuids$',
      'postButtonDisabled$',
      'nextButtonDisabled$',
    ],
    props: {
      attachment$: { get: () => attachment$ },
      isEditing$: { get: () => isEditing$ },
      monetization$: { get: () => monetization$ },
      size$: { get: () => size$ },
      attachmentError$: { get: () => attachmentError$ },
      remind$: { get: () => remind$ },
      canCreateSupermindRequest$: { get: () => canCreateSupermindRequest$ },
      isSupermindRequest$: { get: () => canCreateSupermindRequest$ },
      supermindRequest$: { get: () => canCreateSupermindRequest$ },
      isSupermindReply$: { get: () => canCreateSupermindRequest$ },
      supermindReply$: { get: () => canCreateSupermindRequest$ },
      isGroupPost$: { get: () => isGroupPost$ },
      canPost$: { get: () => canPost$ },
      inProgress$: { get: () => inProgress$ },
      isPosting$: { get: () => isPosting$ },
      siteMembershipGuids$: { get: () => siteMembershipGuids$ },
      postButtonDisabled$: { get: () => postButtonDisabled$ },
      nextButtonDisabled$: { get: () => nextButtonDisabled$ },
    },
  });

  const popupServiceMock: any = MockService(PopupService, {
    create: function () {
      return this;
    },
    present: { toPromise: () => {} },
  });

  let uploaderServiceMock;
  let isTenantServiceMock: any;
  let permissionsServiceMock: any;

  beforeEach(waitForAsync(() => {
    uploaderServiceMock = jasmine.createSpyObj<UploaderService>(
      'UploaderService',
      {
        reset: jasmine.createSpy('reset') as any,
      },
      {
        file$$: new Subject(),
        files$: of([]),
        filesCount$: of(0),
      }
    );

    isTenantServiceMock = jasmine.createSpyObj('IsTenantService', ['is']);

    permissionsServiceMock = jasmine.createSpyObj('PermissionsService', [
      'canCreatePaywall',
      'canUploadAudio',
    ]);
    permissionsServiceMock.canUploadAudio.and.returnValue(true);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ApolloTestingModule],

      declarations: [
        ToolbarComponent,
        ButtonComponent,
        MockComponent(
          {
            selector: 'm-file-upload',
            inputs: ['wrapperClass', 'disabled', 'multiple'],
            outputs: ['onSelect'],
          },
          ['reset']
        ),
        MockComponent({
          selector: 'm-icon',
          inputs: ['from', 'iconId', 'sizeFactor'],
        }),
        MockComponent({
          selector: 'm-composer__recordButton',
          outputs: ['recordingEnded'],
          template: `<div id="record-button"></div>`,
        }),
        MockComponent({
          selector: 'm-emojiPicker',
          outputs: ['emojiSelect'],
        }),
        IfTenantDirective,
      ],
      providers: [
        {
          provide: ComposerService,
          useValue: composerServiceMock,
        },
        {
          provide: ComposerBoostService,
          useValue: MockService(ComposerBoostService, {
            has: ['isBoostMode$'],
            props: {
              isBoostMode$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: PopupService,
          useValue: popupServiceMock,
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
        {
          provide: AttachmentApiService,
          useValue: MockService(AttachmentApiService),
        },
        {
          provide: UploaderService,
          useValue: uploaderServiceMock,
        },
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
        {
          provide: PermissionsService,
          useValue: permissionsServiceMock,
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: PermissionIntentsService,
          useValue: MockService(PermissionIntentsService),
        },
        {
          provide: NsfwEnabledService,
          useValue: MockService(NsfwEnabledService),
        },
        { provide: IsTenantService, useValue: isTenantServiceMock },
        {
          provide: IfTenantDirective,
          useValue: MockService(IfTenantDirective),
        },
        {
          provide: SiteMembershipsCountService,
          useValue: MockService(SiteMembershipsCountService, {
            has: ['count$'],
            props: {
              count$: {
                get: () => siteMembershipCount$,
              },
            },
          }),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: IS_TENANT_NETWORK,
          useValue: false,
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(ToolbarComponent);
    comp = fixture.componentInstance;
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

  it('should should set narrow mode', () => {
    spyOnProperty(
      comp.toolbarWrapper.nativeElement,
      'clientWidth',
      'get'
    ).and.returnValue(100);
    fixture.detectChanges();

    comp.calcNarrow();
    expect(comp.narrow).toBe(true);
  });

  it('should should not set narrow mode', () => {
    spyOnProperty(
      comp.toolbarWrapper.nativeElement,
      'clientWidth',
      'get'
    ).and.returnValue(10000);
    fixture.detectChanges();

    comp.calcNarrow();
    expect(comp.narrow).toBe(false);
  });

  it('should emit on attachment select', () => {
    spyOn(uploaderServiceMock.file$$, 'next');

    const file = new File([], '');
    fixture.detectChanges();

    comp.onAttachmentSelect([file]);

    expect(uploaderServiceMock.file$$.next).toHaveBeenCalledWith(file);
  });

  describe('onNsfwClick', () => {
    beforeEach(() => {
      popupServiceMock.create.calls.reset();
      popupServiceMock.present.calls.reset();
    });

    it('should emit on NSFW popup when not in boost mode', () => {
      (comp as any).composerBoostService.isBoostMode$.next(false);

      comp.onNsfwClick();

      expect(popupServiceMock.create).toHaveBeenCalledWith(NsfwComponent);
      expect(popupServiceMock.present).toHaveBeenCalled();
    });

    it('should not trigger NSFW popup when in boost mode', () => {
      (comp as any).composerBoostService.isBoostMode$.next(true);

      comp.onNsfwClick();

      expect((comp as any).toaster.error).toHaveBeenCalledOnceWith(
        'NSFW content cannot be boosted'
      );
      expect(popupServiceMock.create).not.toHaveBeenCalled();
      expect(popupServiceMock.present).not.toHaveBeenCalled();
    });
  });

  it('should emit on monetize popup', () => {
    comp.onMonetizeClick();
    expect(popupServiceMock.create).toHaveBeenCalledWith(
      ComposerMonetizeV2Component
    );
    expect(popupServiceMock.present).toHaveBeenCalled();
  });

  it('should emit on tags popup', () => {
    comp.onTagsClick();
    expect(popupServiceMock.create).toHaveBeenCalledWith(TagsComponent);
    expect(popupServiceMock.present).toHaveBeenCalled();
  });

  it('should emit on schedule popup', () => {
    comp.onSchedulerClick();
    expect(popupServiceMock.create).toHaveBeenCalledWith(ScheduleComponent);
    expect(popupServiceMock.present).toHaveBeenCalled();
  });

  it('should emit on supermind popup', () => {
    comp.onSupermindClick();
    expect(popupServiceMock.create).toHaveBeenCalledWith(
      ComposerSupermindComponent
    );
    expect(popupServiceMock.present).toHaveBeenCalled();
  });

  it('should show the post button when no siteMembershipGuids', () => {
    composerServiceMock.siteMembershipGuids$.next(null);
    fixture.detectChanges();

    const postButton = fixture.debugElement.query(
      By.css('[data-ref=post-button]')
    );
    const nextButton = fixture.debugElement.query(
      By.css('[data-ref=composer-next-button]')
    );

    expect(postButton).toBeTruthy();
    expect(nextButton).toBeFalsy();
  });

  it('should show the next button when siteMembershipGuids has value', () => {
    composerServiceMock.siteMembershipGuids$.next(['123']);
    fixture.detectChanges();

    const nextButton = fixture.debugElement.query(
      By.css('[data-ref=composer-next-button]')
    );
    expect(nextButton).toBeTruthy();
  });

  it('should not display the monetization button on tenant sites', () => {
    isTenantServiceMock.is.and.returnValue(true);
    fixture.detectChanges();

    const monetizationButton = fixture.debugElement.query(
      By.css('[data-ref=monetize-button]')
    );

    expect(monetizationButton).toBeFalsy();
  });

  it('should not display the site membership button when not a tenant site', () => {
    isTenantServiceMock.is.and.returnValue(false);

    fixture.detectChanges();

    const membershipButton = fixture.debugElement.query(
      By.css('[data-ref=site-membership-button]')
    );

    expect(membershipButton).toBeFalsy();
  });
  describe('onAudioRecordingEnded', () => {
    it('should not ask user to confirm when there are no existing uploads', async () => {
      (comp as any).uploadCount = 0;
      spyOn(window, 'confirm');
      spyOn(comp, 'onAttachmentSelect');

      await (comp as any).onAudioRecordingEnded([]);

      expect(comp.onAttachmentSelect).toHaveBeenCalled();
      expect(window.confirm).not.toHaveBeenCalled();
      expect(uploaderServiceMock.reset).not.toHaveBeenCalled();
    });

    it('should ask user to confirm when there are existing uploads, and replace any existing uploads', async () => {
      (comp as any).uploadCount = 1;
      (comp as any).uploaderService.reset.and.returnValue(Promise.resolve());
      spyOn(comp, 'onAttachmentSelect');
      spyOn(window, 'confirm').and.returnValue(true);

      await (comp as any).onAudioRecordingEnded([]);

      expect(window.confirm).toHaveBeenCalledWith(
        'You are about to replace existing uploads. Are you sure?'
      );
      expect(uploaderServiceMock.reset).toHaveBeenCalled();
      expect(comp.onAttachmentSelect).toHaveBeenCalled();
    });

    it('should not replace existing uploads when user cancels', async () => {
      (comp as any).uploadCount = 1;
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(comp, 'onAttachmentSelect');

      await (comp as any).onAudioRecordingEnded([]);

      expect(window.confirm).toHaveBeenCalledWith(
        'You are about to replace existing uploads. Are you sure?'
      );
      expect(comp.onAttachmentSelect).not.toHaveBeenCalled();
      expect(uploaderServiceMock.reset).not.toHaveBeenCalled();
    });
  });
});
