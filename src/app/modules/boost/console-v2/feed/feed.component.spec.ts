import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostConsoleFeedComponent } from './feed.component';

describe('BoostConsoleFeedComponent', () => {
  let component: BoostConsoleFeedComponent;
  let fixture: ComponentFixture<BoostConsoleFeedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BoostConsoleFeedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoostConsoleFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
