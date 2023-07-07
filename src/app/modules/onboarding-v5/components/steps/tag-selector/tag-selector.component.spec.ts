import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { OnboardingV5TagSelectorContentComponent } from './tag-selector.component';
import { OnboardingV5Service } from '../../../services/onboarding-v5.service';
import {
  DiscoveryTagsService,
  DiscoveryTag,
} from '../../../../discovery/tags/tags.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import { MockComponent, MockService } from '../../../../../utils/mock';
import { ComponentOnboardingV5OnboardingStep } from '../../../../../../graphql/generated.strapi';

describe('OnboardingV5TagSelectorContentComponent', () => {
  let comp: OnboardingV5TagSelectorContentComponent;
  let fixture: ComponentFixture<OnboardingV5TagSelectorContentComponent>;

  const mockTags: DiscoveryTag[] = [
    { selected: true, value: 'tag1', type: 'user' },
    { selected: false, value: 'tag2', type: 'user' },
    { selected: true, value: 'tag3', type: 'user' },
  ];

  const mockData: ComponentOnboardingV5OnboardingStep = {
    title: 'title',
    description: 'description',
    actionButton: {
      dataRef: 'data-ref2',
      id: 'id2',
      text: 'Continue',
    },
    skipButton: null,
    carousel: null,
    id: null,
    stepType: null,
    stepKey: 'tag-selector',
    tagSelector: {
      id: '0',
      customTagInputText: 'customTagInputText',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        OnboardingV5TagSelectorContentComponent,
        MockComponent({
          selector: 'm-onboardingV5__footer',
          inputs: ['disabledActionButton', 'actionButton', 'skipButton'],
          outputs: ['actionButtonClick', 'skipButtonClick'],
        }),
      ],
      providers: [
        {
          provide: OnboardingV5Service,
          useValue: MockService(OnboardingV5Service),
        },
        {
          provide: DiscoveryTagsService,
          useValue: MockService(DiscoveryTagsService, {
            has: ['tags$', 'userAndDefault$'],
            props: {
              tags$: {
                get: () => new BehaviorSubject<DiscoveryTag[]>(mockTags),
              },
              userAndDefault$: {
                get: () => new BehaviorSubject<DiscoveryTag[]>(mockTags),
              },
            },
          }),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingV5TagSelectorContentComponent);
    comp = fixture.componentInstance;

    comp.title = 'title';
    comp.description = 'description';
    comp.data = mockData;

    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  it('should load tags on component init', () => {
    comp.ngOnInit();
    expect((comp as any).tagsService.loadTags).toHaveBeenCalled();
  });

  it('should add or remove a tag on tag click', async () => {
    const tag: DiscoveryTag = { selected: false, value: 'tag4', type: 'user' };

    // Add tag
    await comp.onTagClick(tag);
    expect(tag.selected).toBe(true);
    expect((comp as any).tagsService.addTag).toHaveBeenCalledWith(tag);

    // Remove tag
    await comp.onTagClick(tag);
    expect(tag.selected).toBe(false);
    expect((comp as any).tagsService.removeTag).toHaveBeenCalledWith(tag);
  });

  it('should save tags and continue on action button click', fakeAsync(() => {
    comp.onActionButtonClick();
    expect((comp as any).tagsService.saveTags).toHaveBeenCalled();
    tick();
    expect((comp as any).service.continue).toHaveBeenCalled();
  }));

  it('should continue on skip button click', () => {
    comp.onSkipButtonClick();
    expect((comp as any).service.continue).toHaveBeenCalled();
  });

  it('should handle submission of a custom tag', () => {
    const event = new KeyboardEvent('keypress');
    const formControl = comp.formGroup.get('customTag');
    formControl.setValue('customTag');

    comp.onCustomInputSubmit(event);
    expect((comp as any).tagsService.addTag).toHaveBeenCalledWith({
      selected: true,
      value: 'customTag',
      type: 'user',
    });
  });
});
