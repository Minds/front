import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAdminConsoleNsfwToggleComponent } from './nsfw-toggle.component';

describe('NetworkAdminConsoleNsfwToggleComponent', () => {
  let component: NetworkAdminConsoleNsfwToggleComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleNsfwToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworkAdminConsoleNsfwToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkAdminConsoleNsfwToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
