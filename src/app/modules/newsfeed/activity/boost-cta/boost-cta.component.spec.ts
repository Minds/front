import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { ActivityBoostCtaComponent } from './boost-cta.component';
import { MockService } from '../../../../utils/mock';
import { Session } from '../../../../services/session';
import { ClientMetaService } from '../../../../common/services/client-meta.service';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { BoostGoalsExperimentService } from '../../../experiments/sub-services/boost-goals-experiment.service';
import activityMock from '../../../../mocks/responses/activity.mock';

describe('ActivityBoostCtaComponent', () => {
  let comp: ActivityBoostCtaComponent;
  let fixture: ComponentFixture<ActivityBoostCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityBoostCtaComponent],
      providers: [
        {
          provide: BoostGoalsExperimentService,
          useValue: MockService(BoostGoalsExperimentService),
        },
        {
          provide: Session,
          useValue: MockService(Session),
        },
        {
          provide: ClientMetaService,
          useValue: MockService(ClientMetaService),
        },
        {
          provide: ClientMetaDirective,
          useValue: MockService(ClientMetaDirective),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityBoostCtaComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });
});
