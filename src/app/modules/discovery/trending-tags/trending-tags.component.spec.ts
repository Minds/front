import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryTrendingTagsComponent } from './trending-tags.component';

describe('TrendingTagsComponent', () => {
  let component: DiscoveryTrendingTagsComponent;
  let fixture: ComponentFixture<DiscoveryTrendingTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscoveryTrendingTagsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoveryTrendingTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
