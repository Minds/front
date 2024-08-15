import { TestBed } from '@angular/core/testing';
import { MultiTenantNavigationService } from './navigation.service';
import {
  DeleteCustomNavigationItemGQL,
  GetNavigationItemsGQL,
  ReorderNavigationItemsGQL,
  UpsertNavigationItemGQL,
} from '../../../../../../../graphql/generated.engine';
import { ToasterService } from '../../../../../../common/services/toaster.service';
import { ModalService } from '../../../../../../services/ux/modal.service';
import { Injector } from '@angular/core';
import { MockService } from '../../../../../../utils/mock';

describe('MultiTenantNavigationService', () => {
  let service: MultiTenantNavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GetNavigationItemsGQL,
          useValue: jasmine.createSpyObj<GetNavigationItemsGQL>(['fetch']),
        },
        {
          provide: UpsertNavigationItemGQL,
          useValue: jasmine.createSpyObj<UpsertNavigationItemGQL>(['mutate']),
        },
        {
          provide: DeleteCustomNavigationItemGQL,
          useValue: jasmine.createSpyObj<DeleteCustomNavigationItemGQL>([
            'mutate',
          ]),
        },
        {
          provide: ReorderNavigationItemsGQL,
          useValue: jasmine.createSpyObj<ReorderNavigationItemsGQL>(['mutate']),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        { provide: ModalService, useValue: MockService(ModalService) },
        Injector,
        MultiTenantNavigationService,
      ],
    });

    service = TestBed.inject(MultiTenantNavigationService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct disabledMobileItems', () => {
    expect(service.disabledMobileItems).toEqual({
      boost: { defaultState: false },
      admin: { defaultState: false },
      memberships: { defaultState: false },
      newsfeed: { defaultState: true },
      explore: { defaultState: true },
    });
  });

  it('should have correct disabledWebItems', () => {
    expect(service.disabledWebItems).toEqual({
      admin: { defaultState: true },
    });
  });
});
