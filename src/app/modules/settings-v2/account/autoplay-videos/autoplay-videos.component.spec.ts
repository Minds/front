import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsV2AutoplayVideosComponent } from './autoplay-videos.component';
import { ChangeDetectorRef } from '@angular/core';
import { Session } from '../../../../services/session';
import { MockService } from '../../../../utils/mock';
import { SettingsV2Service } from '../../settings-v2.service';
import { BehaviorSubject } from 'rxjs';

describe('SettingsV2AutoplayVideosComponent', () => {
  let component: SettingsV2AutoplayVideosComponent;
  let fixture: ComponentFixture<SettingsV2AutoplayVideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsV2AutoplayVideosComponent],
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsV2AutoplayVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
