import { MockService } from '../../../utils/mock';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscoveryFeedsService } from '../feeds/feeds.service';

import { DiscoveryTrendingTagsComponent } from './trending-tags.component';

describe('TrendingTagsComponent', () => {
  let component: DiscoveryTrendingTagsComponent;
  let fixture: ComponentFixture<DiscoveryTrendingTagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DiscoveryTrendingTagsComponent],
      providers: [
        {
          provide: DiscoveryFeedsService,
          useValue: MockService(DiscoveryFeedsService),
        },
      ],
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
