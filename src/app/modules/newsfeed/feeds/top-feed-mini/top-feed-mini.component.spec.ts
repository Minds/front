import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFeedMiniComponent } from './top-feed-mini.component';

describe('TopFeedMiniComponent', () => {
  let component: TopFeedMiniComponent;
  let fixture: ComponentFixture<TopFeedMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopFeedMiniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopFeedMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
