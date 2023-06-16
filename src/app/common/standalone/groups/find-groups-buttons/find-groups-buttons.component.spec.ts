import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindGroupsButtonsComponent } from './find-groups-buttons.component';

describe('FindGroupsButtonsComponent', () => {
  let component: FindGroupsButtonsComponent;
  let fixture: ComponentFixture<FindGroupsButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FindGroupsButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FindGroupsButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
