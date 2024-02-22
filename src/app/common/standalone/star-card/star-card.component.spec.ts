import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StarCardComponent } from './star-card.component';

describe('StarCardComponent', () => {
  let comp: StarCardComponent;
  let fixture: ComponentFixture<StarCardComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [StarCardComponent],
    });

    fixture = TestBed.createComponent(StarCardComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });
});
