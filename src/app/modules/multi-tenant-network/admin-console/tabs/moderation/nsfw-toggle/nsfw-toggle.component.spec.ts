import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAdminConsoleNsfwToggleComponent } from './nsfw-toggle.component';
import { NsfwEnabledService } from '../../../../services/nsfw-enabled.service';
import { MockService } from '../../../../../../utils/mock';
import { EventEmitter } from '@angular/core';

describe('NetworkAdminConsoleNsfwToggleComponent', () => {
  let component: NetworkAdminConsoleNsfwToggleComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleNsfwToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleNsfwToggleComponent],
      providers: [
        {
          provide: NsfwEnabledService,
          useValue: MockService(NsfwEnabledService, {
            has: ['nsfwEnabled$'],
            props: {
              nsfwEnabled$: { get: () => new EventEmitter<boolean>() },
            },
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkAdminConsoleNsfwToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
