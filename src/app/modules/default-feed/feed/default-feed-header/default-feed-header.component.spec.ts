import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultFeedHeaderComponent } from './default-feed-header.component';

describe('DefaultFeedHeaderComponent', () => {
  let component: DefaultFeedHeaderComponent;
  let fixture: ComponentFixture<DefaultFeedHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DefaultFeedHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultFeedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
