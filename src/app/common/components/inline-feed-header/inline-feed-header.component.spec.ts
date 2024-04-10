import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { InlineFeedHeaderComponent } from './inline-feed-header.component';

describe('InlineFeedHeaderComponent', () => {
  let comp: InlineFeedHeaderComponent;
  let fixture: ComponentFixture<InlineFeedHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [InlineFeedHeaderComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InlineFeedHeaderComponent);
    comp = fixture.componentInstance;
    comp.text = 'Test feed';
    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('text content', () => {
    it('should show the tag text', () => {
      const text: DebugElement = fixture.debugElement.query(
        By.css('.m-inlineFeedHeader__text')
      );
      expect(text.nativeElement.innerText).toBe('Test feed');
    });
  });
});
