import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityBoostCtaComponent } from './boost-cta.component';
import { MockComponent, MockService } from '../../../../utils/mock';
import { Session } from '../../../../services/session';
import { ClientMetaService } from '../../../../common/services/client-meta.service';
import { ClientMetaDirective } from '../../../../common/directives/client-meta.directive';
import { BoostGoalButtonText } from '../../../boost/boost.types';
import { By } from '@angular/platform-browser';

describe('ActivityBoostCtaComponent', () => {
  let comp: ActivityBoostCtaComponent;
  let fixture: ComponentFixture<ActivityBoostCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ActivityBoostCtaComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'solid', 'size'],
          outputs: ['onAction'],
          template: `<ng-content></ng-content>`,
        }),
      ],
      providers: [
        {
          provide: Session,
          useValue: MockService(Session),
        },
        {
          provide: ClientMetaService,
          useValue: MockService(ClientMetaService),
        },
        {
          provide: ClientMetaDirective,
          useValue: MockService(ClientMetaDirective),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityBoostCtaComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('render with url', () => {
    it("should render CTA text for 'subscribe to my channel'", () => {
      (comp as any).textEnum = BoostGoalButtonText.SUBSCRIBE_TO_MY_CHANNEL;
      (comp as any).url = 'https://example.minds.com';
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-button span')).nativeElement
          .textContent
      ).toContain('Subscribe to my channel');
    });

    it("should render CTA text for 'get connected'", () => {
      (comp as any).textEnum = BoostGoalButtonText.GET_CONNECTED;
      (comp as any).url = 'https://example.minds.com';
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-button span')).nativeElement
          .textContent
      ).toContain('Get connected');
    });

    it("should render CTA text for 'stay in the loop'", () => {
      (comp as any).textEnum = BoostGoalButtonText.STAY_IN_THE_LOOP;
      (comp as any).url = 'https://example.minds.com';
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-button span')).nativeElement
          .textContent
      ).toContain('Stay in the loop');
    });

    it("should render CTA text for 'learn more'", () => {
      (comp as any).textEnum = BoostGoalButtonText.LEARN_MORE;
      (comp as any).url = 'https://example.minds.com';
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-button span')).nativeElement
          .textContent
      ).toContain('Learn more');
    });

    it("should render CTA text for 'get connected'", () => {
      (comp as any).textEnum = BoostGoalButtonText.GET_STARTED;
      (comp as any).url = 'https://example.minds.com';
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-button span')).nativeElement
          .textContent
      ).toContain('Get started');
    });

    it("should render CTA text for 'sign up'", () => {
      (comp as any).textEnum = BoostGoalButtonText.SIGN_UP;
      (comp as any).url = 'https://example.minds.com';
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-button span')).nativeElement
          .textContent
      ).toContain('Sign up');
    });

    it("should render CTA text for 'try for free'", () => {
      (comp as any).textEnum = BoostGoalButtonText.TRY_FOR_FREE;
      (comp as any).url = 'https://example.minds.com';
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-button span')).nativeElement
          .textContent
      ).toContain('Try for free');
    });

    it("should render CTA text for 'shop now'", () => {
      (comp as any).textEnum = BoostGoalButtonText.SHOP_NOW;
      (comp as any).url = 'https://example.minds.com';
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-button span')).nativeElement
          .textContent
      ).toContain('Shop now');
    });

    it("should render CTA text for 'buy now'", () => {
      (comp as any).textEnum = BoostGoalButtonText.BUY_NOW;
      (comp as any).url = 'https://example.minds.com';
      fixture.detectChanges();

      expect(
        fixture.debugElement.query(By.css('m-button span')).nativeElement
          .textContent
      ).toContain('Buy now');
    });
  });
});
