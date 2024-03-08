import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkAdminAnalyticsEmptyStateCardComponent } from './empty-state-card.component';
import { MockComponent } from '../../../../../../../../utils/mock';

describe('NetworkAdminAnalyticsEmptyStateCardComponent', () => {
  let comp: NetworkAdminAnalyticsEmptyStateCardComponent;
  let fixture: ComponentFixture<NetworkAdminAnalyticsEmptyStateCardComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      declarations: [
        NetworkAdminAnalyticsEmptyStateCardComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'solid', 'size'],
          outputs: ['onAction'],
          template: `<ng-content></ng-content>`,
        }),
      ],
    });

    fixture = TestBed.createComponent(
      NetworkAdminAnalyticsEmptyStateCardComponent
    );
    comp = fixture.componentInstance;

    Object.defineProperty(comp, 'title', {
      writable: true,
      value: 'title',
    });

    Object.defineProperty(comp, 'icon', {
      writable: true,
      value: 'icon',
    });

    Object.defineProperty(comp, 'description', {
      writable: true,
      value: 'description',
    });

    Object.defineProperty(comp, 'ctaText', {
      writable: true,
      value: 'ctaText',
    });

    Object.defineProperty(comp, 'ctaIcon', {
      writable: true,
      value: 'ctaIcon',
    });

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

  it('should render based on inputs', () => {
    expect(
      fixture.debugElement.nativeElement
        .querySelector('.m-networkAdminEmptyStateCard__container--left i')
        .textContent.trim()
    ).toBe('icon');

    expect(
      fixture.debugElement.nativeElement
        .querySelector('.m-networkAdminEmptyStateCard__title')
        .textContent.trim()
    ).toBe('title');

    expect(
      fixture.debugElement.nativeElement
        .querySelector('.m-networkAdminEmptyStateCard__description')
        .textContent.trim()
    ).toBe('description');

    expect(
      fixture.debugElement.nativeElement
        .querySelector('m-button i')
        .textContent.trim()
    ).toBe('ctaIcon');

    expect(
      fixture.debugElement.nativeElement
        .querySelector('m-button span')
        .textContent.trim()
    ).toBe('ctaText');
  });
});
