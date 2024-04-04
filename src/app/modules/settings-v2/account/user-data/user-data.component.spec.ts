import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { Session } from '../../../../services/session';
import { MockService } from '../../../../utils/mock';
import { SettingsV2Service } from '../../settings-v2.service';
import { BehaviorSubject } from 'rxjs';
import { SettingsV2UserDataComponent } from './user-data.component';
import { ConfigsService } from '../../../../common/services/configs.service';
import { AnalyticsService } from '../../../../services/analytics';

describe('SettingsV2UserDataComponent', () => {
  let component: SettingsV2UserDataComponent;
  let fixture: ComponentFixture<SettingsV2UserDataComponent>;
  let configsService: Partial<ConfigsService>;
  let analyticsService;

  beforeEach(() => {
    configsService = {
      get: key => {
        return <any>{};
      },
    };

    TestBed.configureTestingModule({
      declarations: [SettingsV2UserDataComponent],
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
});
