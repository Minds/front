import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  StrapiAction,
  StrapiActionResolverService,
} from '../../../common/services/strapi/strapi-action-resolver.service';
import { MarketingGeneralSectionComponent } from './general-section.component';
import { MockService } from '../../../utils/mock';
import { MarkdownModule } from 'ngx-markdown';
import { ButtonComponent } from '../../../common/components/button/button.component';

describe('MarketingGeneralSectionComponent', () => {
  let comp: MarketingGeneralSectionComponent;
  let fixture: ComponentFixture<MarketingGeneralSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MarkdownModule.forRoot()],
      declarations: [MarketingGeneralSectionComponent, ButtonComponent],
      providers: [
        {
          provide: StrapiActionResolverService,
          useValue: MockService(StrapiActionResolverService),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketingGeneralSectionComponent);
    comp = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(comp).toBeTruthy();
  });

  // Title
  it('should show title when title is set', () => {
    comp.title = 'Test title';
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(
      By.css('.m-marketing__body h2')
    );
    expect(titleElement.nativeElement.textContent).toEqual('Test title');
  });

  // Body
  it('should show body when body is set', () => {
    comp.body = 'Test body';
    fixture.detectChanges();

    const bodyElement = fixture.debugElement.query(
      By.css('.m-marketing__description')
    );
    expect(bodyElement.nativeElement.textContent.trim()).toEqual('Test body');
  });

  // Image
  it('should not show image when imageUrl is not set', () => {
    comp.imageUrl = '';
    fixture.detectChanges();

    const imageElement = fixture.debugElement.query(
      By.css('.m-marketing__image--1')
    );
    expect(imageElement).toBeNull();
  });

  it('should show image when imageUrl is set', () => {
    comp.imageUrl = 'testImageUrl';
    fixture.detectChanges();

    const imageElement = fixture.debugElement.query(
      By.css('.m-marketing__image--1')
    );
    expect(imageElement.nativeElement.src).toContain('testImageUrl');
  });

  // Image Overlay
  it('should not show image overlay when imageOverlayUrl is not set', () => {
    comp.imageOverlayUrl = '';
    fixture.detectChanges();

    const imageOverlayElement = fixture.debugElement.query(
      By.css('.m-marketing__image--2')
    );
    expect(imageOverlayElement).toBeNull();
  });

  it('should show image overlay when imageOverlayUrl is set', () => {
    comp.imageOverlayUrl = 'testImageOverlayUrl';
    fixture.detectChanges();

    const imageOverlayElement = fixture.debugElement.query(
      By.css('.m-marketing__image--2')
    );
    expect(imageOverlayElement.nativeElement.src).toContain(
      'testImageOverlayUrl'
    );
  });

  // Action Buttons
  it('should not show action buttons when actionButtons is empty', () => {
    comp.actionButtons = [];
    fixture.detectChanges();

    const actionButtonsElement = fixture.debugElement.query(
      By.css('.m-marketing__buttonWrapper')
    );
    expect(actionButtonsElement.children.length).toEqual(0);
  });

  it('should show action buttons when actionButtons is not empty', () => {
    comp.actionButtons = [{ text: 'Test Button', action: {} as StrapiAction }];
    fixture.detectChanges();

    const actionButtonsElement = fixture.debugElement.query(
      By.css('.m-marketing__buttonWrapper')
    );
    expect(actionButtonsElement.children.length).toBeGreaterThan(0);
    expect(actionButtonsElement.children[0].nativeElement.textContent).toEqual(
      ' Test Button '
    );
  });

  // Show Body Background
  it('should not have body background when showBodyBackground is false', () => {
    comp.showBodyBackground = false;
    fixture.detectChanges();

    const bodyBackgroundElement = fixture.debugElement.query(
      By.css('.m-marketing__body')
    );
    expect(
      bodyBackgroundElement.classes['m-marketing__body--noBodyBackground']
    ).toBeTrue();
  });

  it('should have body background when showBodyBackground is true', () => {
    comp.showBodyBackground = true;
    fixture.detectChanges();

    const bodyBackgroundElement = fixture.debugElement.query(
      By.css('.m-marketing__body')
    );
    expect(
      bodyBackgroundElement.classes['m-marketing__body--noBodyBackground']
    ).toBeFalsy();
  });

  // Show Background Effects
  it('should not show background effects when showBackgroundEffects is false', () => {
    comp.showBackgroundEffects = false;
    fixture.detectChanges();

    const backgroundEffectsElement = fixture.debugElement.query(
      By.css('.m-marketing__image span')
    );
    expect(
      backgroundEffectsElement.classes[
        'm-marketing__imageSpan--noBackgroundEffects'
      ]
    ).toBeTrue();
  });

  it('should show background effects when showBackgroundEffects is true', () => {
    comp.showBackgroundEffects = true;
    fixture.detectChanges();

    const backgroundEffectsElement = fixture.debugElement.query(
      By.css('.m-marketing__image span')
    );
    expect(
      backgroundEffectsElement.classes[
        'm-marketing__imageSpan--noBackgroundEffects'
      ]
    ).toBeFalsy();
  });

  // LeftAligned
  it('should have left alignment when leftAligned is true', () => {
    comp.leftAligned = true;
    fixture.detectChanges();

    const sectionElement = fixture.debugElement.query(
      By.css('.m-marketing__section')
    );
    expect(sectionElement.classes['m-marketing__section--style-3']).toBeTrue();
    expect(sectionElement.classes['m-marketing__section--style-4']).toBeFalsy();
  });

  it('should not have left alignment when leftAligned is false', () => {
    comp.leftAligned = false;
    fixture.detectChanges();

    const sectionElement = fixture.debugElement.query(
      By.css('.m-marketing__section')
    );
    expect(sectionElement.classes['m-marketing__section--style-4']).toBeTrue();
    expect(sectionElement.classes['m-marketing__section--style-3']).toBeFalsy();
  });
});
