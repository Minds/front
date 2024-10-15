import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscoverySidebarTagsComponent } from './sidebar-tags.component';
import { DiscoveryTagsService } from './tags.service';
import { Session } from '../../../services/session';
import { ComposerModalService } from '../../composer/components/modal/modal.service';
import { ToasterService } from '../../../common/services/toaster.service';
import { PermissionsService } from '../../../common/services/permissions.service';
import { MockComponent, MockService } from '../../../utils/mock';
import { BehaviorSubject, of, Subject } from 'rxjs';

describe('DiscoverySidebarTagsComponent', () => {
  let comp: DiscoverySidebarTagsComponent;
  let fixture: ComponentFixture<DiscoverySidebarTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DiscoverySidebarTagsComponent,
        MockComponent({
          selector: 'm-sidebarWidget',
          inputs: ['titleText'],
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['size', 'stretch', 'solid'],
          outputs: ['onAction'],
        }),
        MockComponent({
          selector: 'm-discovery__tagButton',
          inputs: ['tag'],
        }),
        MockComponent({
          selector: 'm-discovery__adminExcludeButton',
          inputs: ['tag'],
        }),
      ],
      providers: [
        {
          provide: DiscoveryTagsService,
          useValue: MockService(DiscoveryTagsService, {
            has: ['inProgress$', 'trending$', 'activityRelated$'],
            props: {
              inProgress$: { get: () => new BehaviorSubject<boolean>(false) },
              trending$: { get: () => new BehaviorSubject<any[]>([]) },
              activityRelated$: { get: () => new BehaviorSubject<any[]>([]) },
            },
          }),
        },
        {
          provide: Session,
          useValue: MockService(Session, {
            has: ['loggedinEmitter'],
            props: {
              loggedinEmitter: { get: () => new Subject<boolean>() },
            },
          }),
        },
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoverySidebarTagsComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set default context if not provided', () => {
      comp.ngOnInit();
      expect((comp as any)._context).toBe('user');
    });

    it('should load activity related tags if entityGuid is provided', () => {
      comp.entityGuid = '123';
      comp.ngOnInit();
      expect((comp as any).tagsService.loadTags).toHaveBeenCalledWith(
        true,
        '123'
      );
      expect((comp as any).source$.getValue()).toBe('activityRelated');
    });

    it('should load trending tags if no entityGuid and trending is empty', () => {
      comp.ngOnInit();
      expect((comp as any).tagsService.loadTags).toHaveBeenCalled();
      expect((comp as any).source$.getValue()).toBe('trending');
    });

    it('should set limit to 12 if user is not logged in', () => {
      (comp as any).session.isLoggedIn.and.returnValue(false);
      comp.ngOnInit();
      expect(comp.limit).toBe(12);
    });

    it('should set canModerateContent$ based on permissions', () => {
      (comp as any).permissions.canModerateContent.and.returnValue(true);
      comp.ngOnInit();
      expect((comp as any).canModerateContent$.getValue()).toBe(true);
    });
  });
});
