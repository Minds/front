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
import { AutoLoginService } from '../../networks/auto-login.service';

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
        {
          provide: AutoLoginService,
          useValue: MockService(AutoLoginService),
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
    const loginUrl: string = 'loginUrl';
    const jwtToken: string = 'jwtToken';

    (service as any).startTenantTrialGql.mutate.and.returnValue(
      of({
        data: {
          tenantTrial: {
            loginUrl: loginUrl,
            jwtToken: jwtToken,
            tenant: { id: '1' },
          },
        },
      })
    );

    service.startTrial();
    tick();

    expect((service as any).startTenantTrialGql.mutate).toHaveBeenCalled();
    expect(
      (service as any).autoLoginService.openNetworkUrl
    ).toHaveBeenCalledOnceWith(loginUrl, jwtToken, false);
    expect((service as any).router.navigateByUrl).not.toHaveBeenCalled();
    expect((service as any).toaster.error).not.toHaveBeenCalled();
  }));

  it('should handle start trial request success with no returned login url', fakeAsync(() => {
    (service as any).startTenantTrialGql.mutate.and.returnValue(
      of({
        data: {
          tenantTrial: {
            tenant: { id: '1' },
          },
        },
      })
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
