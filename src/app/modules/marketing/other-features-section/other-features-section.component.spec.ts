import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MarkdownModule } from 'ngx-markdown';
import { MarketingOtherFeaturesSectionComponent } from './other-features-section.component';

describe('MarketingOtherFeaturesSectionComponent', () => {
  let comp: MarketingOtherFeaturesSectionComponent;
  let fixture: ComponentFixture<MarketingOtherFeaturesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MarketingOtherFeaturesSectionComponent],
      imports: [MarkdownModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingOtherFeaturesSectionComponent);
    comp = fixture.componentInstance;
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  // title
  it('should show title when title is set', () => {
    comp.title = 'Test title';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(
      By.css('.m-marketing__body h2')
    );
    expect(titleElement.nativeElement.textContent).toEqual('Test title');
  });

  it('should not show title when title is not set', () => {
    comp.title = '';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(
      By.css('.m-marketing__body h2')
    );
    expect(titleElement).toBeNull();
  });

  // column1Title
  it('should show column1Title when it is set', () => {
    comp.column1Title = 'Test column1Title';
    fixture.detectChanges();

    const column1TitleElement = fixture.debugElement.queryAll(
      By.css('.m-marketing__body h3')
    )[0];
    expect(column1TitleElement.nativeElement.textContent).toEqual(
      'Test column1Title'
    );
  });

  // column2Title
  it('should show column2Title when it is set', () => {
    comp.column2Title = 'Test column2Title';
    fixture.detectChanges();

    const column2TitleElement = fixture.debugElement.queryAll(
      By.css('.m-marketing__body h3')
    )[1];
    expect(column2TitleElement.nativeElement.textContent).toEqual(
      'Test column2Title'
    );
  });

  // column3Title
  it('should show column3Title when it is set', () => {
    comp.column3Title = 'Test column3Title';
    fixture.detectChanges();

    const column3TitleElement = fixture.debugElement.queryAll(
      By.css('.m-marketing__body h3')
    )[2];
    expect(column3TitleElement.nativeElement.textContent).toEqual(
      'Test column3Title'
    );
  });
});
