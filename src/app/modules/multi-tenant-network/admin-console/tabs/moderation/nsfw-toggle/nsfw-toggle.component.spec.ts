import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAdminConsoleNsfwToggleComponent } from './nsfw-toggle.component';
import { NsfwEnabledService } from '../../../../services/nsfw-enabled.service';
import { MockService } from '../../../../../../utils/mock';

describe('NetworkAdminConsoleNsfwToggleComponent', () => {
  let component: NetworkAdminConsoleNsfwToggleComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleNsfwToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleNsfwToggleComponent],
      providers: [
        {
          provide: NsfwEnabledService,
          useValue: MockService(NsfwEnabledService),
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
