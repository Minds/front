import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { Session } from '../../../../services/session';
import { MockService } from '../../../../utils/mock';
import { SettingsV2Service } from '../../settings-v2.service';
import { BehaviorSubject } from 'rxjs';
import { SettingsV2UserDataComponent } from './user-data.component';
import { ConfigsService } from '../../../../common/services/configs.service';
import { AnalyticsService } from '../../../../services/analytics';
import { DeletePostHogPersonGQL } from '../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ButtonComponent } from '../../../../common/components/button/button.component';

describe('SettingsV2UserDataComponent', () => {
  let component: SettingsV2UserDataComponent;
  let fixture: ComponentFixture<SettingsV2UserDataComponent>;
  let configsService: Partial<ConfigsService>;
  let analyticsService;
  let deletePostHogPersonGql: DeletePostHogPersonGQL;

  beforeEach(() => {
    configsService = {
      get: key => {
        return <any>{};
      },
    };

    deletePostHogPersonGql = jasmine.createSpyObj<DeletePostHogPersonGQL>([
      'mutate',
    ]);

    TestBed.configureTestingModule({
      declarations: [SettingsV2UserDataComponent, ButtonComponent],
      providers: [
        ChangeDetectorRef,
        { provide: Session, useValue: MockService(Session) },
        {
          provide: SettingsV2Service,
          useValue: MockService(SettingsV2Service, {
            has: ['settings$'],
            props: {
              settings$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
            },
          }),
        },
        {
          provide: ConfigsService,
          useValue: configsService,
        },
        {
          provide: AnalyticsService,
          useValue: analyticsService,
        },
        ToasterService,
        {
          provide: DeletePostHogPersonGQL,
          useValue: deletePostHogPersonGql,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2UserDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have checkbox selected if already opted out', () => {
    spyOn(configsService, 'get').and.returnValue({ opt_out: true });

    component.ngOnInit();

    expect(component.optOut.value).toBe(true);
  });

  it('should have checkbox not-selected if not opted out', () => {
    spyOn(configsService, 'get').and.returnValue({ opt_out: false });

    component.ngOnInit();

    expect(component.optOut.value).toBe(false);
  });

  it('should delete a users data when clicking the button', fakeAsync(() => {
    const btn = fixture.debugElement.nativeElement.querySelector(
      'm-button button'
    );
    btn.click();

    tick();

    expect(deletePostHogPersonGql.mutate).toHaveBeenCalled();
  }));
});
