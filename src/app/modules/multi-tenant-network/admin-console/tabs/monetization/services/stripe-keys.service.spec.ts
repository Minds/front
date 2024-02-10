import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StripeKeysService } from './stripe-keys.service';
import {
  GetStripeKeysGQL,
  SetStripeKeysGQL,
  StripeKeysType,
} from '../../../../../../../graphql/generated.engine';
import { MockService } from '../../../../../../utils/mock';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { of, throwError } from 'rxjs';

describe('StripeKeysService', () => {
  let service: StripeKeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StripeKeysService,
        {
          provide: GetStripeKeysGQL,
          useValue: jasmine.createSpyObj<GetStripeKeysGQL>(['fetch']),
        },
        {
          provide: SetStripeKeysGQL,
          useValue: jasmine.createSpyObj<SetStripeKeysGQL>(['mutate']),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });
    service = TestBed.inject(StripeKeysService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('hasSetStripeKeys$', () => {
    it('should return true if stripeKeys has pubKey and secKey', (done: DoneFn) => {
      service.stripeKeys$.next({ pubKey: 'pubKey', secKey: 'secKey' });
      service.hasSetStripeKeys$.subscribe((hasSet: boolean) => {
        expect(hasSet).toBeTrue();
        done();
      });
    });

    it('should return false if stripeKeys does not have pubKey and secKey', (done: DoneFn) => {
      service.stripeKeys$.next(null);
      service.hasSetStripeKeys$.subscribe((hasSet: boolean) => {
        expect(hasSet).toBeFalse();
        done();
      });
    });
  });

  describe('fetchStripeKeys', () => {
    it('should set fetchInProgress to false and initialized to true on success', fakeAsync(() => {
      const stripeKeys: StripeKeysType = { pubKey: 'pubKey', secKey: 'secKey' };
      (service as any).getStripeKeysGQL.fetch.and.returnValue(
        of({ data: { stripeKeys: stripeKeys } })
      );

      service.fetchStripeKeys();
      tick();

      expect(service.stripeKeys$.getValue()).toEqual(stripeKeys);
      expect(service.fetchInProgress$.getValue()).toBeFalse();
      expect(service.initialized$.getValue()).toBeTrue();
    }));

    it('should set fetchInProgress to false on error', fakeAsync(() => {
      (service as any).getStripeKeysGQL.fetch.and.returnValue(
        throwError(() => 'error')
      );

      service.fetchStripeKeys();
      tick();

      expect((service as any).toaster.error).toHaveBeenCalled();
    }));
  });

  describe('saveStripeKeys', () => {
    it('should set stripeKeys and return true on success', async () => {
      service.stripeKeys$.next(null);
      const stripeKeys: StripeKeysType = { pubKey: 'pubKey', secKey: 'secKey' };
      (service as any).setStripeKeyGQL.mutate.and.returnValue(
        of({ data: { setStripeKeys: stripeKeys } })
      );

      expect(
        await service.saveStripeKeys(stripeKeys.pubKey, stripeKeys.secKey)
      ).toBeTrue();
      expect(service.stripeKeys$.getValue()).toEqual(stripeKeys);
    });

    it('should handle an error while saving stripe keys', async () => {
      const stripeKeys: StripeKeysType = { pubKey: 'pubKey', secKey: 'secKey' };
      (service as any).setStripeKeyGQL.mutate.and.returnValue(
        of({ errors: [{ message: 'error' }] })
      );

      let caughtError: any = null;
      try {
        await service.saveStripeKeys(stripeKeys.pubKey, stripeKeys.secKey);
      } catch (e) {
        caughtError = e;
      }

      expect(caughtError).toEqual(new Error('error'));
    });
  });
});
