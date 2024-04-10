import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChipBadgeComponent } from './chip-badge.component';

describe('ChipBadgeComponent', () => {
  let comp: ChipBadgeComponent;
  let fixture: ComponentFixture<ChipBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ChipBadgeComponent],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(ChipBadgeComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  it('should initialize', () => {
    expect(comp).toBeTruthy();
  });
});
