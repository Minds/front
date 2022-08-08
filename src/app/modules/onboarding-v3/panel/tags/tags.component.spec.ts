import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockService } from '../../../../utils/mock';
import { DefaultTagsV2ExperimentService } from '../../../experiments/sub-services/default-tags-v2-experiment.service';
import { OnboardingV3TagsComponent } from './tags.component';
import { OnboardingV3TagsService } from './tags.service';

describe('OnboardingV3TagsComponent', () => {
  let comp: OnboardingV3TagsComponent;
  let fixture: ComponentFixture<OnboardingV3TagsComponent>;

  const tagsMock: any = MockService(OnboardingV3TagsService);
  const defaultTagsV2ExperimentMock: any = MockService(
    DefaultTagsV2ExperimentService
  );

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OnboardingV3TagsComponent],
        providers: [
          {
            provide: OnboardingV3TagsService,
            useValue: tagsMock,
          },
          {
            provide: DefaultTagsV2ExperimentService,
            useValue: defaultTagsV2ExperimentMock,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 2;
    fixture = TestBed.createComponent(OnboardingV3TagsComponent);
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

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should set default tags v2 experiment to active when experiment is active', () => {
    (comp as any).defaultTagsV2Experiment.isActive.and.returnValue(true);
    comp.ngOnInit();
    expect(comp.defaultTagsV2ExperimentActive).toBeTrue();
  });

  it('should set default tags v2 experiment to not active when experiment is not active', () => {
    (comp as any).defaultTagsV2Experiment.isActive.and.returnValue(false);
    comp.ngOnInit();
    expect(comp.defaultTagsV2ExperimentActive).toBeFalse();
  });
});
