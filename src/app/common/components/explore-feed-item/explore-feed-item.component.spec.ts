import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreFeedItemComponent } from './explore-feed-item.component';

describe('ExploreFeedItemComponent', () => {
  let component: ExploreFeedItemComponent;
  let fixture: ComponentFixture<ExploreFeedItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExploreFeedItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExploreFeedItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
