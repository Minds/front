import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryTopHeaderComponent } from './discovery-top-header.component';

describe('DiscoveryTopHeaderComponent', () => {
  let component: DiscoveryTopHeaderComponent;
  let fixture: ComponentFixture<DiscoveryTopHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscoveryTopHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoveryTopHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
