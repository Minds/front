import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NetworksTrialCreationService } from './networks-trial-creation.service';
import { Router } from '@angular/router';
import { MockService } from '../../../utils/mock';
import { StartTenantTrialGQL } from '../../../../graphql/generated.engine';
import {
  DEFAULT_ERROR_MESSAGE,
  ToasterService,
} from '../../../common/services/toaster.service';
import { of } from 'rxjs';

describe('NetworksTrialCreationService', () => {
  let service: NetworksTrialCreationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NetworksTrialCreationService,
        { provide: Router, useValue: MockService(Router) },
        {
          provide: StartTenantTrialGQL,
          useValue: jasmine.createSpyObj<StartTenantTrialGQL>(['mutate']),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    });

    service = TestBed.inject(NetworksTrialCreationService);
    spyOn(console, 'error');
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should handle start trial request success', fakeAsync(() => {
    (service as any).startTenantTrialGql.mutate.and.returnValue(
      of({ data: { tenantTrial: { id: '1' } } })
    );

    service.startTrial();
    tick();

    expect((service as any).startTenantTrialGql.mutate).toHaveBeenCalled();
    expect((service as any).router.navigateByUrl).toHaveBeenCalledWith(
      '/networks'
    );
    expect((service as any).toaster.error).not.toHaveBeenCalled();
  }));

  it('should handle start trial request errors', fakeAsync(() => {
    (service as any).startTenantTrialGql.mutate.and.returnValue(
      of({ errors: [{ message: 'Error' }] })
    );

    service.startTrial();
    tick();

    expect((service as any).startTenantTrialGql.mutate).toHaveBeenCalled();
    expect((service as any).router.navigateByUrl).not.toHaveBeenCalledWith(
      '/networks'
    );
    expect((service as any).toaster.error).toHaveBeenCalledWith('Error');
  }));

  it('should handle start trial request returning no data', fakeAsync(() => {
    (service as any).startTenantTrialGql.mutate.and.returnValue(
      of({ data: null })
    );

    service.startTrial();
    tick();

    expect((service as any).startTenantTrialGql.mutate).toHaveBeenCalled();
    expect((service as any).router.navigateByUrl).not.toHaveBeenCalledWith(
      '/networks'
    );
    expect((service as any).toaster.error).toHaveBeenCalledWith(
      DEFAULT_ERROR_MESSAGE
    );
  }));

  it('should handle start trial request throwing an exception', fakeAsync(() => {
    (service as any).startTenantTrialGql.mutate.and.throwError(
      new Error('Error')
    );

    service.startTrial();
    tick();

    expect((service as any).startTenantTrialGql.mutate).toHaveBeenCalled();
    expect((service as any).router.navigateByUrl).not.toHaveBeenCalledWith(
      '/networks'
    );
    expect((service as any).toaster.error).toHaveBeenCalledWith('Error');
  }));
});
