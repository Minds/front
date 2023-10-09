import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MockComponent } from '../../../../../utils/mock';
import { ProductPageHeroComponent } from './hero.component';
import { By } from '@angular/platform-browser';

describe('ProductPageHeroComponent', () => {
  let comp: ProductPageHeroComponent;
  let fixture: ComponentFixture<ProductPageHeroComponent>;

  const mockText: string = 'Text';

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ProductPageHeroComponent,
          MockComponent({
            selector: 'markdown',
            inputs: ['data'],
          }),
        ],
      }).compileComponents();
    })
  );

  beforeEach(done => {
    fixture = TestBed.createComponent(ProductPageHeroComponent);
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'text', { writable: true });
    (comp as any).text = mockText;

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
    expect(fixture.debugElement.query(By.css('markdown'))).toBeTruthy();
  });
});
