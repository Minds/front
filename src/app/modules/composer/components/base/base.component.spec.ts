import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseComponent } from './base.component';
import { ComposerService } from '../../services/composer.service';
import { PopupService } from '../popup/popup.service';
import { InMemoryStorageService } from '../../../../services/in-memory-storage.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ConfigsService } from '../../../../common/services/configs.service';
import { BlogPreloadService } from '../../../blogs/v2/edit/blog-preload.service';
import { UploaderService } from '../../services/uploader.service';
import { ComposerModalService } from '../modal/modal.service';
import {
  MockComponent,
  MockDirective,
  MockService,
} from '../../../../utils/mock';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ComposerAudienceSelectorPanelComponent } from '../popup/audience-selector/audience-selector.component';
import { ComposerAudienceSelectorService } from '../../services/audience.service';
import { PermissionsService } from '../../../../common/services/permissions.service';
import { ComposerSiteMembershipsService } from '../../services/site-memberships.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { SiteMembership } from '../../../../../graphql/generated.engine';
import { SimpleChange } from '@angular/core';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';
import { By } from '@angular/platform-browser';

describe('BaseComponent', () => {
  let comp: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;
  let showMembershipPreviewPaneSubscription: Subscription;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApolloTestingModule],
      declarations: [
        BaseComponent,
        MockDirective({
          selector: 'm-dragAndDrop',
        }),
        MockDirective({
          selector: 'm-clientMeta',
        }),
        MockComponent({
          selector: 'm-composer__titleBar',
          inputs: ['inputId'],
          outputs: ['onCreateBlog'],
        }),
        MockComponent({
          selector: 'm-composer__textArea',
          inputs: ['inputId', 'compactMode', 'disabled', 'isModal'],
          outputs: ['filePaste'],
        }),
        MockComponent({
          selector: 'm-composer__previewWrapper',
        }),
        MockComponent({
          selector: 'm-composerPreview--quote',
        }),
        MockComponent({
          selector: 'm-composer__toolbar',
          inputs: ['isModal'],
          outputs: ['onPost'],
        }),
        MockComponent({
          selector: 'm-composer__popup',
        }),
        MockComponent({
          selector: 'm-composer__siteMembershipPostPreview',
          inputs: ['isModal'],
        }),
        MockComponent({ selector: 'm-composer__livestream' }),
        MockComponent({ selector: 'm-composer__audienceSelectorButton' }),
        MockComponent({ selector: 'm-composer__boostToggle' }),
      ],
      providers: [
        {
          provide: ComposerService,
          useValue: MockService(ComposerService, {
            has: [
              'attachmentError$',
              'size$',
              'supermindRequest$',
              'isDirty$',
              'message$',
              'isMovingContent$',
              'isEditing$',
              'showSiteMembershipPostPreview$',
            ],
            props: {
              attachmentError$: { get: () => new BehaviorSubject<any>(null) },
              size$: { get: () => new BehaviorSubject<any>('compact') },
              supermindRequest$: { get: () => new BehaviorSubject<any>(null) },
              isDirty$: { get: () => new BehaviorSubject<boolean>(false) },
              message$: { get: () => new BehaviorSubject<string>('') },
              isMovingContent$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              isEditing$: { get: () => new BehaviorSubject<boolean>(false) },
              showSiteMembershipPostPreview$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: ComposerAudienceSelectorService,
          useValue: MockService(ComposerAudienceSelectorService, {
            has: ['shareToGroupMode$'],
            props: {
              shareToGroupMode$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        { provide: Router, useValue: MockService(Router) },
        {
          provide: InMemoryStorageService,
          useValue: MockService(InMemoryStorageService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: ConfigsService,
          useValue: new (function () {
            this.get = jasmine
              .createSpy('get')
              .and.returnValue({ support_tier_urn: '~support_tier_urn~' });
          })(),
        },
        {
          provide: BlogPreloadService,
          useValue: MockService(BlogPreloadService),
        },
        { provide: UploaderService, useValue: MockService(UploaderService) },
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: ComposerSiteMembershipsService,
          useValue: MockService(ComposerSiteMembershipsService, {
            has: ['allMemberships$'],
            props: {
              allMemberships$: {
                get: () => new BehaviorSubject<SiteMembership[]>([]),
              },
            },
          }),
        },
        {
          provide: IS_TENANT_NETWORK,
          useValue: false,
        },
      ],
    })
      .overrideProvider(PopupService, {
        useValue: MockService(PopupService),
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseComponent);
    comp = fixture.componentInstance;

    (comp as any).service.message$.next('');
    (comp as any).service.isMovingContent$.next(false);
    (comp as any).service.supermindRequest$.next(null);
    (comp as any).audienceSelectorService.shareToGroupMode$.next(false);

    fixture.detectChanges();
  });

  afterEach(() => {
    if (showMembershipPreviewPaneSubscription) {
      showMembershipPreviewPaneSubscription.unsubscribe();
    }
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should handle blog creation request', () => {
    const message: string = 'test message';
    (comp as any).service.message$.next(message);
    comp.createBlog();

    expect((comp as any).service.message$.getValue()).toBe(message);
    expect((comp as any).blogPreloadService.next).toHaveBeenCalledWith(message);
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/blog/v2/edit/new',
    ]);
    expect((comp as any).composerModal.dismiss).toHaveBeenCalled();
  });

  it('should display audience selector popup on init when in share to group mode', () => {
    (comp as any).audienceSelectorService.shareToGroupMode$.next(true);
    (comp as any).service.supermindRequest$.next(null);

    (comp as any).popup.setUp.calls.reset();
    (comp as any).popup.present.and.returnValue(
      new BehaviorSubject<boolean>(true)
    );
    (comp as any).popup.create.and.returnValue((comp as any).popup);

    comp.ngAfterViewInit();

    expect((comp as any).popup.setUp).toHaveBeenCalledTimes(1);
    expect((comp as any).popup.create).toHaveBeenCalledOnceWith(
      ComposerAudienceSelectorPanelComponent
    );
    expect((comp as any).popup.present).toHaveBeenCalledTimes(1);
  });

  it('should NOT display audience selector popup on init when NOT in share to group mode', () => {
    (comp as any).audienceSelectorService.shareToGroupMode$.next(false);
    (comp as any).service.supermindRequest$.next(null);

    (comp as any).popup.setUp.calls.reset();
    (comp as any).popup.present.and.returnValue(
      new BehaviorSubject<boolean>(true)
    );
    (comp as any).popup.create.and.returnValue((comp as any).popup);

    comp.ngAfterViewInit();

    expect((comp as any).popup.setUp).toHaveBeenCalledTimes(1);
    expect((comp as any).popup.create).not.toHaveBeenCalledOnceWith(
      ComposerAudienceSelectorPanelComponent
    );
    expect((comp as any).popup.present).not.toHaveBeenCalledTimes(1);
  });

  it('should show membership preview pane only when in modal and showSiteMembershipPostPreview$ emits true', async () => {
    comp.isModal = true;
    fixture.detectChanges();

    const changesObj = {
      isModal: new SimpleChange(null, comp.isModal, true),
    };
    comp.ngOnChanges(changesObj);
    fixture.detectChanges();

    (comp as any).service.showSiteMembershipPostPreview$.next(true);
    fixture.detectChanges();

    const showPreviewPane = await new Promise((resolve) => {
      showMembershipPreviewPaneSubscription =
        comp.showMembershipPreviewPane$.subscribe((value) => resolve(value));
      fixture.detectChanges();
    });

    expect(showPreviewPane).toBeTrue();
  });

  it('should not show membership preview pane if not in modal, regardless of showSiteMembershipPostPreview$', async () => {
    comp.isModal = false;
    fixture.detectChanges();

    const changesObj = {
      isModal: new SimpleChange(null, comp.isModal, true),
    };
    comp.ngOnChanges(changesObj);
    fixture.detectChanges();

    (comp as any).service.showSiteMembershipPostPreview$.next(true);
    fixture.detectChanges();

    const showPreviewPane = await new Promise((resolve) => {
      showMembershipPreviewPaneSubscription =
        comp.showMembershipPreviewPane$.subscribe((value) => resolve(value));
      fixture.detectChanges();
    });

    expect(showPreviewPane).toBeFalse();
  });

  it('should not show membership preview pane if in modal but showSiteMembershipPostPreview$ emits false', async () => {
    comp.isModal = true;
    fixture.detectChanges();

    const changesObj = {
      isModal: new SimpleChange(null, comp.isModal, true),
    };
    comp.ngOnChanges(changesObj);
    fixture.detectChanges();

    (comp as any).service.showSiteMembershipPostPreview$.next(false);
    fixture.detectChanges();

    const showPreviewPane = await new Promise((resolve) => {
      showMembershipPreviewPaneSubscription =
        comp.showMembershipPreviewPane$.subscribe((value) => resolve(value));
      fixture.detectChanges();
    });

    expect(showPreviewPane).toBeFalse();
  });

  describe('m-composer__audienceSelectorButton render', () => {
    it('should show audience selector button when in modal and not editing', () => {
      (comp as any).service.isEditing$.next(false);
      comp.isModal = true;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-composer__audienceSelectorButton'))
      ).not.toBeNull();
    });

    it('should NOT show audience selector button when in modal and editing', () => {
      (comp as any).service.isEditing$.next(true);
      comp.isModal = true;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-composer__audienceSelectorButton'))
      ).toBeNull();
    });

    it('should NOT show audience selector button when NOT in modal', () => {
      (comp as any).service.isEditing$.next(false);
      comp.isModal = false;
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-composer__audienceSelectorButton'))
      ).toBeNull();
    });
  });

  describe('m-composer__boostToggle render', () => {
    it('should show boost toggle when user can boost, it is not in a modal and we are not editing', () => {
      Object.defineProperty(comp, 'isTenantNetwork', {
        writable: true,
        value: false,
      });
      comp.isModal = true;
      (comp as any).permissions.canBoost.and.returnValue(true);
      (comp as any).isEditing$.next(false);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-composer__boostToggle'))
      ).not.toBeNull();
    });

    it('should show boost toggle when user can boost, it is not in a modal and we are not editing, on a tenant network with boost enabled', () => {
      Object.defineProperty(comp, 'isTenantNetwork', {
        writable: true,
        value: true,
      });
      (comp as any).configs.get.withArgs('tenant').and.returnValue({
        boost_enabled: true,
      });
      comp.isModal = true;
      (comp as any).permissions.canBoost.and.returnValue(true);
      (comp as any).isEditing$.next(false);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-composer__boostToggle'))
      ).not.toBeNull();
    });

    it('should NOT show boost toggle when we are editing', () => {
      Object.defineProperty(comp, 'isTenantNetwork', {
        writable: true,
        value: false,
      });
      comp.isModal = true;
      (comp as any).permissions.canBoost.and.returnValue(true);
      (comp as any).isEditing$.next(true);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-composer__boostToggle'))
      ).toBeNull();
    });

    it('should NOT show boost toggle when not in a modal', () => {
      Object.defineProperty(comp, 'isTenantNetwork', {
        writable: true,
        value: false,
      });
      comp.isModal = false;
      (comp as any).permissions.canBoost.and.returnValue(true);
      (comp as any).isEditing$.next(false);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-composer__boostToggle'))
      ).toBeNull();
    });

    it('should NOT show boost toggle when user cannot Boost', () => {
      Object.defineProperty(comp, 'isTenantNetwork', {
        writable: true,
        value: false,
      });
      comp.isModal = true;
      (comp as any).permissions.canBoost.and.returnValue(false);
      (comp as any).isEditing$.next(false);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-composer__boostToggle'))
      ).toBeNull();
    });

    it('should NOT show boost toggle when on a tenant network with Boost not enabled', () => {
      Object.defineProperty(comp, 'isTenantNetwork', {
        writable: true,
        value: true,
      });
      (comp as any).configs.get.withArgs('tenant').and.returnValue({
        boost_enabled: false,
      });
      comp.isModal = true;
      (comp as any).permissions.canBoost.and.returnValue(true);
      (comp as any).isEditing$.next(false);
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-composer__boostToggle'))
      ).toBeNull();
    });
  });
});
