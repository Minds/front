import { TestBed } from '@angular/core/testing';
import { BoostAdminActionsService } from './admin-actions.service';
import { AdminCancelBoostsGQL } from '../../../../../graphql/generated.engine';
import { of } from 'rxjs';

describe('BoostAdminActionsService', () => {
  let service: BoostAdminActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BoostAdminActionsService,
        {
          provide: AdminCancelBoostsGQL,
          useValue: jasmine.createSpyObj<AdminCancelBoostsGQL>(['mutate']),
        },
      ],
    });

    service = TestBed.inject(BoostAdminActionsService);
    spyOn(console, 'error');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('cancelBoostsByEntityGuid', () => {
    it('should return true when the mutation is successful', async () => {
      (service as any).adminCancelBoostsGQL.mutate.and.returnValue(
        of({ data: { adminCancelBoosts: true } })
      );

      const result = await service.cancelBoostsByEntityGuid('1234');

      expect(result).toBe(true);
      expect((service as any).adminCancelBoostsGQL.mutate).toHaveBeenCalledWith(
        { entityGuid: '1234' }
      );
    });

    it('should handle errors', async () => {
      (service as any).adminCancelBoostsGQL.mutate.and.throwError(
        'An error occurred'
      );

      await service.cancelBoostsByEntityGuid('1234');

      expect(console.error).toHaveBeenCalledWith(
        new Error('An error occurred')
      );
    });
  });
});
