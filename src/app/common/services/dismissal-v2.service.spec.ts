import { TestBed } from '@angular/core/testing';
import { DismissalV2Service } from './dismissal-v2.service';
import {
  DismissDocument,
  Dismissal,
  GetDismissalsDocument,
} from '../../../graphql/generated.engine';
import { firstValueFrom } from 'rxjs';
import {
  ApolloTestingController,
  ApolloTestingModule,
} from 'apollo-angular/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Session } from '../../services/session';
import { MockService } from '../../utils/mock';
import userMock from '../../mocks/responses/user.mock';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';

describe('DismissalV2Service', () => {
  let service: DismissalV2Service;
  let controller: ApolloTestingController;

  const mockDismissals: Dismissal[] = [
    {
      userGuid: '1524118581841760275',
      key: 'affiliates',
      dismissalTimestamp: 1688982416,
    },
    {
      userGuid: '1524118581841760275',
      key: 'groups_memberships',
      dismissalTimestamp: 1688982422,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule.withClients(['strapi'])],
      providers: [
        DismissalV2Service,
        { provide: Session, useValue: MockService(Session) },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(DismissalV2Service);
    controller = TestBed.inject(ApolloTestingController);
    (service as any).session.getLoggedInUser.and.returnValue(userMock);
    (service as any).session.isLoggedIn.and.returnValue(userMock);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be init', () => {
    expect(service).toBeTruthy();
  });

  describe('getDismissals', () => {
    it('should get dismissals from cache', async () => {
      spyOn(localStorage.__proto__, 'getItem').and.returnValue(
        JSON.stringify(mockDismissals)
      );
      expect(await firstValueFrom(service.getDismissals())).toEqual(
        mockDismissals
      );
    });

    it('should get NOT dismissals when user is not logged in', async () => {
      spyOn(localStorage.__proto__, 'getItem').and.returnValue(
        JSON.stringify([])
      );
      (service as any).session.isLoggedIn.and.returnValue(false);
      expect(await firstValueFrom(service.getDismissals())).toEqual([]);
    });

    it('should get dismissals from server when cache is empty', (done: DoneFn) => {
      spyOn(localStorage.__proto__, 'getItem').and.returnValue(null);

      (service as any).getDismissals().subscribe((_mockDismissals) => {
        expect(mockDismissals).toEqual(_mockDismissals);
        controller.verify();
        done();
      });

      const op = controller.expectOne(GetDismissalsDocument);
      op.flush({
        data: {
          dismissals: mockDismissals,
        },
      });
    });

    it('should get dismissals from server when cache is NOT empty, but we opt to bypass the cache', (done: DoneFn) => {
      spyOn(localStorage.__proto__, 'getItem').and.returnValue(mockDismissals);

      (service as any).getDismissals(true).subscribe((_mockDismissals) => {
        expect(mockDismissals).toEqual(_mockDismissals);
        controller.verify();
        done();
      });

      const op = controller.expectOne(GetDismissalsDocument);
      op.flush({
        data: {
          dismissals: mockDismissals,
        },
      });
    });
  });

  describe('isDismissed', () => {
    it('should determine if a notice is dismissed in local storage', async () => {
      spyOn(localStorage.__proto__, 'getItem').and.returnValue(
        JSON.stringify(mockDismissals)
      );
      expect(
        await firstValueFrom(service.isDismissed(mockDismissals[0].key))
      ).toEqual(true);
    });

    it('should determine if a notice is NOT dismissed in local storage', async () => {
      spyOn(localStorage.__proto__, 'getItem').and.returnValue(
        JSON.stringify(mockDismissals)
      );
      expect(
        await firstValueFrom(
          service.isDismissed(`${mockDismissals[0].key}-fake-key`)
        )
      ).toEqual(false);
    });

    it('should determine if a notice is dismissed from server', (done: DoneFn) => {
      spyOn(localStorage.__proto__, 'getItem').and.returnValue(null);

      (service as any)
        .isDismissed(mockDismissals[0].key)
        .subscribe((isDismissed) => {
          expect(isDismissed).toBe(true);
          controller.verify();
          done();
        });

      const op = controller.expectOne(GetDismissalsDocument);
      op.flush({
        data: {
          dismissals: mockDismissals,
        },
      });
    });

    it('should determine if a notice is NOT dismissed from server', (done: DoneFn) => {
      spyOn(localStorage.__proto__, 'getItem').and.returnValue(null);

      (service as any)
        .isDismissed(`${mockDismissals[0].key}-fake-key`)
        .subscribe((isDismissed) => {
          expect(isDismissed).toBe(false);
          controller.verify();
          done();
        });

      const op = controller.expectOne(GetDismissalsDocument);
      op.flush({
        data: {
          dismissals: mockDismissals,
        },
      });
    });
  });

  describe('dismiss', () => {
    it('should dismiss by key', (done: DoneFn) => {
      spyOn(localStorage.__proto__, 'setItem');

      const returnedDismissal: Dismissal = {
        userGuid: '1524118581841760275',
        key: 'affiliates',
        dismissalTimestamp: 1688982416,
      };
      const newKey: string = 'new-key';
      const returnedArray = mockDismissals;
      returnedArray.push(returnedDismissal);

      (service as any).dismiss(newKey).subscribe((dismissal: Dismissal) => {
        expect(dismissal).toEqual(returnedDismissal);
        expect(localStorage.setItem).toHaveBeenCalled();
        controller.verify();
        done();
      });

      const op = controller.expectOne(DismissDocument);
      expect(op.operation.variables.key).toEqual(newKey);
      op.flush({
        data: {
          dismiss: returnedDismissal,
        },
      });
    });
  });
});
