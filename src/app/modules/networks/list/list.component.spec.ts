import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworksListComponent } from './list.component';

describe('NetworksListComponent', () => {
  let component: NetworksListComponent;
  let fixture: ComponentFixture<NetworksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NetworksListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
