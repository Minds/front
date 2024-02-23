import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
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
          inputs: ['inputId', 'compactMode'],
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
        }),
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
          useValue: new (function() {
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

    const showPreviewPane = await new Promise(resolve => {
      showMembershipPreviewPaneSubscription = comp.showMembershipPreviewPane$.subscribe(
        value => resolve(value)
      );
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

    const showPreviewPane = await new Promise(resolve => {
      showMembershipPreviewPaneSubscription = comp.showMembershipPreviewPane$.subscribe(
        value => resolve(value)
      );
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

    const showPreviewPane = await new Promise(resolve => {
      showMembershipPreviewPaneSubscription = comp.showMembershipPreviewPane$.subscribe(
        value => resolve(value)
      );
      fixture.detectChanges();
    });

    expect(showPreviewPane).toBeFalse();
  });
});
