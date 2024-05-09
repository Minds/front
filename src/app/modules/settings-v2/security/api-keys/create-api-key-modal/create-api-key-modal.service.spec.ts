import { TestBed } from '@angular/core/testing';
import { CreateApiKeyModalService } from './create-api-key-modal.service';
import { Injector } from '@angular/core';
import { MockService } from '../../../../../utils/mock';
import { ModalService } from '../../../../../services/ux/modal.service';
import {
  ApiScopeEnum,
  PersonalApiKey,
} from '../../../../../../graphql/generated.engine';

describe('CreateApiKeyModalService', () => {
  let service: CreateApiKeyModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateApiKeyModalService,
        Injector,
        { provide: ModalService, useValue: MockService(ModalService) },
      ],
    });

    service = TestBed.inject(CreateApiKeyModalService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should open', async () => {
    const personalApiKey: PersonalApiKey = {
      __typename: 'PersonalApiKey',
      id: '2',
      name: 'Key 2',
      scopes: [ApiScopeEnum.SiteMembershipWrite],
      secret: 'REDACTED',
      timeCreated: Date.now(),
      timeExpires: Date.now(),
    };
    (service as any).modalService.present.and.returnValue({
      result: personalApiKey,
    });

    expect(await service.open()).toBe(personalApiKey);
    expect((service as any).modalService.present).toHaveBeenCalledWith(
      jasmine.anything(),
      {
        injector: (service as any).injector,
        lazyModule: jasmine.anything(),
        size: 'md',
        data: {
          onCompleted: jasmine.any(Function),
        },
      }
    );
  });
});
