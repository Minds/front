import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { NetworkAdminStripeCredentialsComponent } from './stripe-credentials.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockComponent, MockService } from '../../../../../../../utils/mock';
import { StripeKeysService } from '../../services/stripe-keys.service';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { BehaviorSubject } from 'rxjs';
import { StripeKeysType } from '../../../../../../../../graphql/generated.engine';
import { SiteMembershipService } from '../../../../../../site-memberships/services/site-memberships.service';

describe('NetworkAdminStripeCredentialsComponent', () => {
  let comp: NetworkAdminStripeCredentialsComponent;
  let fixture: ComponentFixture<NetworkAdminStripeCredentialsComponent>;

  beforeEach((done: DoneFn) => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [
        NetworkAdminStripeCredentialsComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'solid', 'disabled', 'saving'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        FormBuilder,
        {
          provide: StripeKeysService,
          useValue: MockService(StripeKeysService, {
            has: ['initialized$', 'fetchInProgress$', 'stripeKeys$'],
            props: {
              initialized$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              fetchInProgress$: {
                get: () => new BehaviorSubject<boolean>(false),
              },
              stripeKeys$: {
                get: () => new BehaviorSubject<StripeKeysType>(null),
              },
            },
          }),
        },
        {
          provide: SiteMembershipService,
          useValue: MockService(SiteMembershipService),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    fixture = TestBed.createComponent(NetworkAdminStripeCredentialsComponent);
    comp = fixture.componentInstance;

    (comp as any).stripeKeysService.initialized$.next(false);
    (comp as any).stripeKeysService.fetchInProgress$.next(false);
    (comp as any).stripeKeysService.stripeKeys$.next(null);

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

  describe('ngOnInit', () => {
    it('should init', () => {
      expect(comp).toBeTruthy();
      expect(
        (comp as any).stripeKeysService.fetchStripeKeys
      ).toHaveBeenCalled();
    });

    it('should init and NOT fetch stripe keys if they have already been fetched', () => {
      (comp as any).stripeKeysService.fetchStripeKeys.calls.reset();
      (comp as any).stripeKeysService.initialized$.next(true);
      (comp as any).stripeKeysService.fetchInProgress$.next(false);
      (comp as any).stripeKeysService.stripeKeys$.next(null);

      comp.ngOnInit();
      expect(
        (comp as any).stripeKeysService.fetchStripeKeys
      ).not.toHaveBeenCalled();
    });

    it('should init and NOT fetch stripe keys if there is already a request to fetch them in progress', () => {
      (comp as any).stripeKeysService.fetchStripeKeys.calls.reset();
      (comp as any).stripeKeysService.initialized$.next(false);
      (comp as any).stripeKeysService.fetchInProgress$.next(true);
      (comp as any).stripeKeysService.stripeKeys$.next(null);

      comp.ngOnInit();
      expect(
        (comp as any).stripeKeysService.fetchStripeKeys
      ).not.toHaveBeenCalled();
    });

    it('should init with stripe keys if some are set', fakeAsync(() => {
      const pubKey: string = 'pubKey';
      const secKey: string = 'secKey';
      (comp as any).stripeKeysService.fetchStripeKeys.calls.reset();
      (comp as any).stripeKeysService.initialized$.next(true);
      (comp as any).stripeKeysService.fetchInProgress$.next(false);
      (comp as any).stripeKeysService.stripeKeys$.next(null);

      (comp as any).stripeKeysService.stripeKeys$.next({
        pubKey: pubKey,
        secKey: secKey,
      });

      comp.ngOnInit();
      tick();

      expect((comp as any).formGroup.get('publicKey').value).toEqual(pubKey);
      expect(comp.hasStoredSecretKey$.getValue()).toBeTrue();
    }));
  });

  describe('onSubmit', () => {
    it('should submit', fakeAsync(() => {
      const pubKey: string = 'pubKey2';
      const secKey: string = 'secKey2';
      (comp as any).formGroup.get('publicKey').setValue(pubKey);
      (comp as any).formGroup.get('secretKey').setValue(secKey);
      (comp as any).submissionInProgress$.next(true);
      (comp as any).stripeKeysService.saveStripeKeys.and.returnValue(
        Promise.resolve(true)
      );
      (comp as any).siteMembershipService.fetch.and.returnValue(
        Promise.resolve([])
      );

      comp.onSubmit();
      tick();

      expect((comp as any).formGroup.pristine).toBeTrue();
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Your Stripe credentials have been saved'
      );
      expect((comp as any).submissionInProgress$.getValue()).toBeFalse();
    }));

    it('should not submit if form values are invalid', fakeAsync(() => {
      const pubKey: string = 'pubKey2';
      const secKey: string = null;
      (comp as any).formGroup.get('publicKey').setValue(pubKey);
      (comp as any).formGroup.get('secretKey').setValue(secKey);
      (comp as any).submissionInProgress$.next(true);
      (comp as any).stripeKeysService.saveStripeKeys.and.returnValue(
        Promise.resolve(true)
      );

      comp.onSubmit();
      tick();

      expect((comp as any).toaster.success).not.toHaveBeenCalled();
      expect((comp as any).toaster.error).toHaveBeenCalled();
      expect((comp as any).submissionInProgress$.getValue()).toBeFalse();
    }));

    it('should handle error on form submit', fakeAsync(() => {
      const pubKey: string = 'pubKey2';
      const secKey: string = 'secKey2';
      (comp as any).formGroup.get('publicKey').setValue(pubKey);
      (comp as any).formGroup.get('secretKey').setValue(secKey);
      (comp as any).submissionInProgress$.next(true);
      (comp as any).stripeKeysService.saveStripeKeys.and.throwError('Error');

      comp.onSubmit();
      tick();

      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        new Error('Error')
      );
      expect((comp as any).toaster.success).not.toHaveBeenCalled();
      expect((comp as any).submissionInProgress$.getValue()).toBeFalse();
    }));

    it('should show toast when changing the public key with active site memberships', fakeAsync(() => {
      const pubKey: string = 'pubKey2';
      const secKey: string = 'secKey2';
      (comp as any).formGroup.get('publicKey').setValue(pubKey);
      (comp as any).formGroup.get('secretKey').setValue(secKey);
      (comp as any).stripeKeysService.saveStripeKeys.and.returnValue(
        Promise.resolve(true)
      );
      (comp as any).siteMembershipService.fetch.and.returnValue(
        Promise.resolve([{}])
      );

      comp.onSubmit();
      tick();

      expect((comp as any).toaster.error).toHaveBeenCalledWith(
        'Please archive all membership tiers related to the current Stripe public key before changing it.'
      );
    }));

    it('should NOT show toast when NOT changing the public key with active site memberships', fakeAsync(() => {
      const pubKey: string = 'pubKey2';
      const secKey: string = 'secKey2';
      (comp as any).formGroup.get('publicKey').setValue(pubKey);
      (comp as any).formGroup.get('secretKey').setValue(secKey);
      (comp as any).stripeKeysService.stripeKeys$.next({
        pubKey: pubKey,
        secKey: secKey,
      });
      (comp as any).stripeKeysService.saveStripeKeys.and.returnValue(
        Promise.resolve(true)
      );
      (comp as any).siteMembershipService.fetch.and.returnValue(
        Promise.resolve([{}])
      );

      comp.onSubmit();
      tick();

      expect((comp as any).formGroup.pristine).toBeTrue();
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Your Stripe credentials have been saved'
      );
    }));
  });
});
