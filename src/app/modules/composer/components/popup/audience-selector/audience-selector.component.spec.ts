import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComposerAudienceSelectorPanelComponent } from './audience-selector.component';
import {
  ActivityContainer,
  ComposerAudienceSelectorService,
} from '../../../services/audience.service';
import { Session } from '../../../../../services/session';
import { Router } from '@angular/router';
import { ComposerModalService } from '../../modal/modal.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';
import { SelectableEntity } from '../../../../../common/components/selectable-entity-card/selectable-entity-card.component';
import userMock from '../../../../../mocks/responses/user.mock';
import { ComposerService } from '../../../services/composer.service';
import { ComposerMonetizeV2Service } from '../monetize/v2/components/monetize.service';
import { ConfigsService } from '../../../../../common/services/configs.service';
import {
  SupportTier,
  SupportTiersService,
} from '../../../../wire/v2/support-tiers.service';

let configMock = new (function () {
  this.get = jasmine.createSpy('get').and.returnValue({
    plus: {
      support_tier_urn: 'urn:123',
    },
  });
})();

const mockSelectableEntities: SelectableEntity[] = [
  {
    guid: '1',
    name: 'Group One',
    type: 'group',
    'members:count': 100,
  },
  {
    guid: '2',
    name: 'Group Two',
    type: 'group',
    'members:count': 200,
  },
  {
    guid: '3',
    name: 'Group Three',
    type: 'group',
    'members:count': 300,
  },
];

const mockSelectableEntitiesContinued: SelectableEntity[] = [
  {
    guid: '4',
    name: 'Group Four',
    type: 'group',
    'members:count': 400,
  },
  {
    guid: '5',
    name: 'Group Five',
    type: 'group',
    'members:count': 500,
  },
  {
    guid: '6',
    name: 'Group Six',
    type: 'group',
    'members:count': 600,
  },
];

describe('ComposerAudienceSelectorPanelComponent', () => {
  let comp: ComposerAudienceSelectorPanelComponent;
  let fixture: ComponentFixture<ComposerAudienceSelectorPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ComposerAudienceSelectorPanelComponent,
        MockComponent({
          selector: 'm-selectableEntityCard',
          inputs: ['entity', 'selected'],
          outputs: ['click'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: ['size', 'color'],
          outputs: ['click', 'onAction'],
        }),
        MockComponent({
          selector: 'm-loadingSpinner',
          inputs: ['inProgress'],
        }),
        MockComponent({
          selector: 'infinite-scroll',
          inputs: [
            'load',
            'inProgress',
            'scrollSource',
            'moreData',
            'distance',
          ],
          outputs: ['load'],
        }),
      ],
      providers: [
        { provide: Session, useValue: MockService(Session) },
        {
          provide: ComposerAudienceSelectorService,
          useValue: MockService(ComposerAudienceSelectorService, {
            has: [
              'selectedAudience$',
              'groupsLoading$',
              'groupsHasNext$',
              'groupsPage$',
              'shareToGroupMode$',
            ],
            props: {
              selectedAudience$: {
                get: () => new BehaviorSubject<ActivityContainer>(null),
              },
              groupsLoading$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              groupsHasNext$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              groupsPage$: {
                get: () =>
                  new BehaviorSubject<SelectableEntity[]>(
                    mockSelectableEntities
                  ),
              },
              shareToGroupMode$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        { provide: Router, useValue: MockService(Router) },
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        {
          provide: ComposerMonetizeV2Service,
          useValue: MockService(ComposerMonetizeV2Service),
        },
        {
          provide: SupportTiersService,
          useValue: MockService(SupportTiersService),
        },
        {
          provide: ComposerService,
          useValue: MockService(ComposerService),
        },
        {
          provide: ConfigsService,
          useValue: configMock,
        },
      ],
    })
      .overrideProvider(SupportTiersService, {
        useValue: MockService(SupportTiersService),
      })
      .overrideProvider(ComposerMonetizeV2Service, {
        useValue: MockService(ComposerMonetizeV2Service, {
          has: ['loaded$', 'supportTiers$'],
          props: {
            loaded$: {
              get: () => new BehaviorSubject<boolean>(false),
            },
            supporTiers$: {
              get: () => new BehaviorSubject<SupportTier>(null),
            },
          },
        }),
      })

      .compileComponents();

    fixture = TestBed.createComponent(ComposerAudienceSelectorPanelComponent);
    comp = fixture.componentInstance;

    (comp as any).audienceSelectorService.selectedAudience$.next(null);
    (comp as any).audienceSelectorService.groupsLoading$.next(false);
    (comp as any).audienceSelectorService.groupsHasNext$.next(false);
    (comp as any).audienceSelectorService.groupsPage$.next(
      mockSelectableEntities
    );
    (comp as any).audienceSelectorService.shareToGroupMode$.next(false);
    (comp as any).session.getLoggedInUser.and.returnValue(userMock);

    fixture.detectChanges();
  });

  it('should initialise', () => {
    expect(comp).toBeTruthy();
    expect(comp.loggedInUser).toEqual(userMock);
    expect(comp.groups$.getValue()).toEqual(mockSelectableEntities);
  });

  it('should append more groups when service emits next groups page', () => {
    (comp as any).audienceSelectorService.groupsPage$.next(
      mockSelectableEntitiesContinued
    );
    expect(comp.groups$.getValue()).toEqual([
      ...mockSelectableEntities,
      ...mockSelectableEntitiesContinued,
    ]);
  });

  it('should reset audience on destroy', () => {
    comp.ngOnDestroy();
    expect((comp as any).audienceSelectorService.reset).toHaveBeenCalled();
  });

  it('should emit to dismiss on save', () => {
    spyOn(comp.dismissIntent, 'emit');
    comp.save();
    expect((comp as any).dismissIntent.emit).toHaveBeenCalled();
  });

  it('should update selected entity on entity selection', () => {
    const newEntity: SelectableEntity = mockSelectableEntities[1];
    expect(
      (comp as any).audienceSelectorService.selectedAudience$.getValue()
    ).not.toEqual(newEntity);

    comp.onEntitySelect(newEntity);
    expect(
      (comp as any).audienceSelectorService.selectedAudience$.getValue()
    ).toEqual(newEntity);
  });

  it('should toggle group section to expand and close', () => {
    comp.groupsExpanded$.next(true);

    comp.toggleGroupsExpand();
    expect(comp.groupsExpanded$.getValue()).toBe(false);

    comp.toggleGroupsExpand();
    expect(comp.groupsExpanded$.getValue()).toBe(true);
  });

  it('should call to load next groups', () => {
    comp.loadNextGroups();
    expect(
      (comp as any).audienceSelectorService.loadNextGroups
    ).toHaveBeenCalledTimes(1);
  });

  it('should dismiss modal and navigate on discover groups click', () => {
    comp.onDiscoverGroupsClick();
    expect((comp as any).composerModalService.dismiss).toHaveBeenCalled();
    expect((comp as any).router.navigate).toHaveBeenCalledWith([
      '/discovery/suggestions/group',
    ]);
  });
});
