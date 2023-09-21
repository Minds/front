import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValuePropCardComponent } from './card.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ValuePropCardComponent', () => {
  let comp: ValuePropCardComponent;
  let fixture: ComponentFixture<ValuePropCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ValuePropCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValuePropCardComponent);
    comp = fixture.componentInstance;

    comp.title = 'title';
    comp.imageUrl = 'https://example.minds.com/imageUrl.png';
    comp.altText = 'altText';
    comp.showBorderTop = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should show title', () => {
    const element: DebugElement = fixture.debugElement.query(
      By.css('.m-valuePropCard__title')
    );
    expect(element.nativeElement.innerText).toBe('title');
  });

  it('should show image with URL', () => {
    const element: DebugElement = fixture.debugElement.query(
      By.css('.m-valuePropCard__image')
    );
    expect(element.nativeElement.src).toBe(
      'https://example.minds.com/imageUrl.png'
    );
  });

  it('should show image with alt text', () => {
    const element: DebugElement = fixture.debugElement.query(
      By.css('.m-valuePropCard__image')
    );
    expect(element.nativeElement.alt).toBe('altText');
  });

  it('should set a top border when showBorderTop is true', () => {
    comp.showBorderTop = true;
    fixture.detectChanges();

    const element: DebugElement = fixture.debugElement.query(
      By.css('.m-valueProp__card')
    );
    expect(element.attributes['class']).toContain(
      'm-valueProp__card--borderTop'
    );
  });

  it('should NOT set a top border when showBorderTop is false', () => {
    comp.showBorderTop = false;
    fixture.detectChanges();

    const element: DebugElement = fixture.debugElement.query(
      By.css('.m-valueProp__card')
    );
    expect(element.attributes['class']).not.toContain(
      'm-valueProp__card--borderTop'
    );
  });
});
