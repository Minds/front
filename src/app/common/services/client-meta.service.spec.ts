import { PLATFORM_ID } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { Session } from '../../services/session';
import { MockService } from '../../utils/mock';
import { ApiService } from '../api/api.service';
import { Client } from '../api/client.service';
import { ClientMetaData, ClientMetaService } from './client-meta.service';

describe('ClientMetaService', () => {
  let service: ClientMetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ClientMetaService,
        { provide: Location, useValue: MockService(Location) },
        { provide: Session, useValue: MockService(Session) },
        { provide: Client, useValue: MockService(Client) },
        { provide: ApiService, useValue: MockService(ApiService) },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(ClientMetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should record a click', fakeAsync(() => {
    const campaign: string = 'urn:boost:234';
    const entityGuid: string = '123';
    const clientMetaDirective = null;
    const extraClientMetaData: Partial<ClientMetaData> = { campaign: campaign };
    (service as any).api.post.and.returnValue(of({ status: 'success' }));

    service.recordClick(entityGuid, clientMetaDirective, extraClientMetaData);
    tick();

    expect((service as any).api.post).toHaveBeenCalledWith(
      `api/v3/analytics/click/${entityGuid}`,
      {
        client_meta: {
          campaign: campaign,
        },
      }
    );
  }));
});
