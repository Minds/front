import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminAnalyticsEmptyStateCardWrapperComponent } from './empty-state-card-wrapper.component';
import { MockComponent, MockService } from '../../../../../../../../utils/mock';
import { ComposerModalService } from '../../../../../../../composer/components/modal/modal.service';
import { CopyToClipboardService } from '../../../../../../../../common/services/copy-to-clipboard.service';
import { ToasterService } from '../../../../../../../../common/services/toaster.service';
import { SITE_URL } from '../../../../../../../../common/injection-tokens/url-injection-tokens';
import { AnalyticsTableEnum } from '../../../../../../../../../graphql/generated.engine';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';

describe('NetworkAdminAnalyticsEmptyStateCardWrapperComponent', () => {
  let comp: NetworkAdminAnalyticsEmptyStateCardWrapperComponent;
  let fixture: ComponentFixture<NetworkAdminAnalyticsEmptyStateCardWrapperComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminAnalyticsEmptyStateCardWrapperComponent,
        MockComponent({
          selector: 'm-networkAdminAnalytics__emptyStateCard',
          inputs: ['title', 'icon', 'description', 'ctaText', 'ctaIcon'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: ComposerModalService,
          useValue: MockService(ComposerModalService),
        },
        {
          provide: CopyToClipboardService,
          useValue: MockService(CopyToClipboardService),
        },
        { provide: Router, useValue: MockService(Router) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: SITE_URL, useValue: 'https://example.minds.com/' },
      ],
    })
      .overrideProvider(ComposerModalService, {
        useValue: MockService(ComposerModalService),
      })
      .overrideProvider(ComposerModalService, {
        useValue: MockService(ComposerModalService),
      });

    fixture = TestBed.createComponent(
      NetworkAdminAnalyticsEmptyStateCardWrapperComponent
    );
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'type', {
      writable: true,
      value: AnalyticsTableEnum.PopularActivities,
    });

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

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should render correct component for PopularActivities enum value', () => {
    (comp as any).type = AnalyticsTableEnum.PopularActivities;
    fixture.detectChanges();

    const emptyStateComponent: DebugElement =
      fixture.nativeElement.querySelector(
        'm-networkAdminAnalytics__emptyStateCard'
      );
    expect(emptyStateComponent).toBeTruthy();

    const attributes: any = emptyStateComponent.attributes;

    expect((attributes.title as any).value).toBe('Ignite the conversation');
    expect((attributes.icon as any).value).toBe('local_fire_department');
    expect((attributes.description as any).value).toBe(
      'The top posts from across the network will appear here.'
    );
    expect((attributes.ctaText as any).value).toBe('Create a post');
  });

  it('should render correct component for PopularGroups enum value', () => {
    (comp as any).type = AnalyticsTableEnum.PopularGroups;
    fixture.detectChanges();

    const emptyStateComponent: DebugElement =
      fixture.nativeElement.querySelector(
        'm-networkAdminAnalytics__emptyStateCard'
      );
    expect(emptyStateComponent).toBeTruthy();

    const attributes: any = emptyStateComponent.attributes;

    expect((attributes.title as any).value).toBe(
      'Be a pioneer in group exploration'
    );
    expect((attributes.icon as any).value).toBe('group');
    expect((attributes.description as any).value).toBe(
      'There are no groups on the network yet. Check back later for detailed analytics once someone has created a group.'
    );
    expect((attributes.ctaText as any).value).toBe('Create group');
  });

  it('should render correct component for PopularUsers enum value', () => {
    (comp as any).type = AnalyticsTableEnum.PopularUsers;
    fixture.detectChanges();

    const emptyStateComponent: DebugElement =
      fixture.nativeElement.querySelector(
        'm-networkAdminAnalytics__emptyStateCard'
      );
    expect(emptyStateComponent).toBeTruthy();

    const attributes: any = emptyStateComponent.attributes;

    expect((attributes.title as any).value).toBe('Get ready for exploration');
    expect((attributes.icon as any).value).toBe('person');
    expect((attributes.description as any).value).toBe(
      'There are no channels apart from yours on the network. Check back later for detailed analytics.'
    );
    expect((attributes.ctaText as any).value).toBe('Copy invite link');
    expect((attributes.ctaIcon as any).value).toBe('content_copy');
  });
});
