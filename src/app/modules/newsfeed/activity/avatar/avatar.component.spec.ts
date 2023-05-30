import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityAvatarComponent } from './avatar.component';
import { ActivityService } from '../activity.service';
import { MockService } from '../../../../utils/mock';
import { Session } from '../../../../services/session';
import { ConfigsService } from '../../../../common/services/configs.service';
import { ExperimentsService } from '../../../experiments/experiments.service';
import { BehaviorSubject } from 'rxjs';

describe('ActivityAvatarComponent', () => {
  let component: ActivityAvatarComponent;
  let fixture: ComponentFixture<ActivityAvatarComponent>;

  let mockDisplayOptions: any = {
    minimalMode: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivityAvatarComponent],
      providers: [
        {
          provide: ActivityService,
          useValue: MockService(ActivityService, {
            has: ['showGroupContext$', 'isRemind$', 'displayOptions'],
            props: {
              showGroupContext$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              isRemind$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              displayOptions: mockDisplayOptions,
            },
          }),
        },
        { provide: Session, useValue: MockService(Session) },
        { provide: ConfigsService, useValue: MockService(ConfigsService) },
        {
          provide: ExperimentsService,
          useValue: MockService(ExperimentsService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
