import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  PlanCardComponent,
  PlanCardPriceTimePeriodEnum,
} from './plan-card.component';
import { MockComponent } from '../../../utils/mock';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('PlanCardComponent', () => {
  let comp: PlanCardComponent;
  let fixture: ComponentFixture<PlanCardComponent>;

  const title: string = 'Title';
  const description: string = '## Description';
  const priceCents: number = 10000;
  const priceTimePeriod: PlanCardPriceTimePeriodEnum =
    PlanCardPriceTimePeriodEnum.Monthly;
  const secondaryPriceCents: number | null = 20000;
  const secondaryPriceTimePeriod: PlanCardPriceTimePeriodEnum =
    PlanCardPriceTimePeriodEnum.OneTimeSetup;
  const priceChangeInProgress: boolean = false;
  const perksTitle: string = 'Features';
  const perks: string[] = ['Perk 1', 'Perk 2', 'Perk 3'];
  const hideCta: boolean = false;
  const ctaText: string = 'Click me';
  const ctaSolid: boolean = false;
  const ctaSaving: boolean = false;
  const ctaDisabled: boolean = false;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlanCardComponent,
        MockComponent({
          selector: 'markdown',
          inputs: ['data'],
        }),
        MockComponent({
          selector: 'm-button',
          inputs: [
            'color',
            'size',
            'stretch',
            'solid',
            'softSquare',
            'saving',
            'disabled',
          ],
          outputs: ['onAction'],
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlanCardComponent);
    comp = fixture.componentInstance;

    comp.title = title;
    comp.description = description;
    comp.priceCents = priceCents;
    comp.priceTimePeriod = priceTimePeriod;
    comp.secondaryPriceCents = secondaryPriceCents;
    comp.secondaryPriceTimePeriod = secondaryPriceTimePeriod;
    comp.priceChangeInProgress = priceChangeInProgress;
    comp.perksTitle = perksTitle;
    comp.perks = perks;
    comp.hideCta = hideCta;
    comp.ctaText = ctaText;
    comp.ctaSolid = ctaSolid;
    comp.ctaSaving = ctaSaving;
    comp.ctaDisabled = ctaDisabled;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('Rendering template', () => {
    it('should have title', () => {
      expect(
        fixture.nativeElement.querySelector('.m-planCard__title').innerText
      ).toEqual(title);
    });

    it('should have button', () => {
      expect(
        fixture.nativeElement.querySelector('.m-planCard__cta--desktop')
      ).not.toBeNull();
    });

    it('should NOT have button when hideCta is true', () => {
      comp.hideCta = true;
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.m-planCard__cta--desktop')
      ).toBeNull();
    });

    it('should have description', () => {
      expect(
        fixture.nativeElement.querySelector('.m-planCard__description')
      ).not.toBeNull();
    });

    it('should NOT have description when none is set', () => {
      comp.description = null;
      fixture.detectChanges();

      expect(
        fixture.nativeElement.querySelector('.m-planCard__description')
      ).toBeNull();
    });

    it('should render price from cents', () => {
      expect(
        fixture.nativeElement.querySelector(
          '.m-planCard__primaryPriceByTime .m-planCard__price'
        ).innerText
      ).toBe('$100');

      expect(
        fixture.nativeElement
          .querySelector(
            '.m-planCard__primaryPriceByTime .m-planCard__priceTimePeriod'
          )
          .innerText.trim()
      ).toBe('/ month');
    });

    it('should render secondary price from cents', () => {
      expect(
        fixture.nativeElement.querySelector(
          '.m-planCard__secondaryPriceByTime .m-planCard__price'
        ).innerText
      ).toBe('$200');

      expect(
        fixture.nativeElement
          .querySelector(
            '.m-planCard__secondaryPriceByTime .m-planCard__priceTimePeriod'
          )
          .innerText.trim()
      ).toBe('/ one time set up');
    });

    it('should render perks title', () => {
      expect(
        fixture.nativeElement.querySelector('.m-planCard__perksTitle').innerText
      ).toBe(perksTitle);
    });

    it('should render perks', () => {
      const perks: DebugElement[] = fixture.debugElement.queryAll(
        By.css('.m-planCard__perk')
      );
      expect(perks.length).toBe(3);
      expect(perks[0].nativeElement.innerText).toContain('Perk 1');
      expect(perks[1].nativeElement.innerText).toContain('Perk 2');
      expect(perks[2].nativeElement.innerText).toContain('Perk 3');
    });
  });
});
