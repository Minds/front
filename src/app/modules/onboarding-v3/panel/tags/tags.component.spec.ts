import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockService } from '../../../../utils/mock';
import { OnboardingV3TagsComponent } from './tags.component';
import { OnboardingV3TagsService } from './tags.service';

describe('OnboardingV3TagsComponent', () => {
  let comp: OnboardingV3TagsComponent;
  let fixture: ComponentFixture<OnboardingV3TagsComponent>;

  const tagsMock: any = MockService(OnboardingV3TagsService);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OnboardingV3TagsComponent],
      providers: [
        {
          provide: OnboardingV3TagsService,
          useValue: tagsMock,
        },
      ],
    }).compileComponents();
  }));

  beforeEach((done) => {
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
});
