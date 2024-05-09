import { TestBed } from '@angular/core/testing';
import { PersonalApiKeysService } from './api-keys.service';
import { ToasterService } from '../../../../../common/services/toaster.service';
import {
  ApiScopeEnum,
  CreatePersonalApiKeyGQL,
  DeletePersonalApiKeyGQL,
  GetPersonalApiKeysGQL,
  GetPersonalApiKeysQuery,
  GetPersonalApiKeysQueryVariables,
  PersonalApiKey,
} from '../../../../../../graphql/generated.engine';
import { MockService } from '../../../../../utils/mock';
import { QueryRef } from 'apollo-angular';
import { BehaviorSubject, of, take } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';

describe('PersonalApiKeysService', () => {
  let service: PersonalApiKeysService;
  let mockPersonalApiKeys: PersonalApiKey[] = [
    {
      __typename: 'PersonalApiKey',
      id: '1',
      name: 'Key 1',
      scopes: [ApiScopeEnum.All],
      secret: 'REDACTED',
      timeCreated: Date.now(),
      timeExpires: Date.now(),
    },
    {
      __typename: 'PersonalApiKey',
      id: '2',
      name: 'Key 2',
      scopes: [ApiScopeEnum.SiteMembershipWrite],
      secret: 'REDACTED',
      timeCreated: Date.now(),
      timeExpires: Date.now(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: GetPersonalApiKeysGQL,
          useValue: jasmine.createSpyObj<GetPersonalApiKeysGQL>(['watch']),
        },
        {
          provide: CreatePersonalApiKeyGQL,
          useValue: jasmine.createSpyObj<CreatePersonalApiKeyGQL>(['mutate']),
        },
        {
          provide: DeletePersonalApiKeyGQL,
          useValue: jasmine.createSpyObj<DeletePersonalApiKeyGQL>(['mutate']),
        },
        { provide: ToasterService, useValue: MockService(ToasterService) },
        PersonalApiKeysService,
      ],
    });

    service = TestBed.inject(PersonalApiKeysService);

    (service as any).getPersonalApiKeysGQL.watch.calls.reset();
    (service as any).createPersonalApiKeyGQL.mutate.calls.reset();
    (service as any).deletePersonalApiKeyGQL.mutate.calls.reset();

    (service as any).queryRef = jasmine.createSpyObj<
      QueryRef<GetPersonalApiKeysQuery, GetPersonalApiKeysQueryVariables>
    >(['refetch', 'valueChanges']);

    (service as any).queryRef.valueChanges = new BehaviorSubject<
      ApolloQueryResult<GetPersonalApiKeysQuery>
    >({
      loading: false,
      networkStatus: 7,
      data: { listPersonalApiKeys: mockPersonalApiKeys },
    });

    spyOn(console, 'warn');
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  it('should refetch', () => {
    service.refetch();
    expect((service as any).queryRef.refetch).toHaveBeenCalled();
  });

  it('should get keys', (done: DoneFn) => {
    (service as any).queryRef.valueChanges.next({
      loading: false,
      networkStatus: 7,
      data: {
        listPersonalApiKeys: mockPersonalApiKeys,
      },
    });

    service.keys$.pipe(take(1)).subscribe((val) => {
      expect(val).toEqual(mockPersonalApiKeys);
      done();
    });
  });

  describe('create', () => {
    it('should create', async () => {
      const vars = {
        name: 'Key 3',
        scopes: [ApiScopeEnum.All],
        expireInDays: 1,
      };

      const result: PersonalApiKey = {
        __typename: 'PersonalApiKey',
        id: '3',
        name: 'Key 3',
        scopes: [ApiScopeEnum.All],
        secret: 'REDACTED',
        timeCreated: Date.now(),
        timeExpires: Date.now(),
      };

      (service as any).createPersonalApiKeyGQL.mutate.and.returnValue(
        of({ data: { createPersonalApiKey: result } })
      );

      expect(await service.create(vars)).toEqual(result);
      expect(
        (service as any).createPersonalApiKeyGQL.mutate
      ).toHaveBeenCalledWith(vars);
    });

    it('should not create if expireInDays < 1', async () => {
      const result: PersonalApiKey = {
        __typename: 'PersonalApiKey',
        id: '3',
        name: 'Key 3',
        scopes: [ApiScopeEnum.All],
        secret: 'REDACTED',
        timeCreated: Date.now(),
        timeExpires: Date.now(),
      };
      (service as any).createPersonalApiKeyGQL.mutate.and.returnValue(
        of({ data: { createPersonalApiKey: result } })
      );

      expect(
        await service.create({
          name: 'Key 3',
          scopes: [ApiScopeEnum.All],
          expireInDays: 0,
        })
      ).toBe(result);
      expect(
        (service as any).createPersonalApiKeyGQL.mutate
      ).toHaveBeenCalledWith({
        name: 'Key 3',
        scopes: [ApiScopeEnum.All],
        expireInDays: null,
      });
    });
  });

  describe('delete', () => {
    it('should delete', async () => {
      (service as any).deletePersonalApiKeyGQL.mutate.and.returnValue(
        of({ data: { deletePersonalApiKey: true } })
      );

      await service.delete('1');
      expect(
        (service as any).deletePersonalApiKeyGQL.mutate
      ).toHaveBeenCalledWith({ id: '1' });
    });

    it('should not delete on error', async () => {
      (service as any).deletePersonalApiKeyGQL.mutate.and.returnValue(
        of({ data: { deletePersonalApiKey: false } })
      );

      try {
        await service.delete('1');
      } catch (e: unknown) {
        expect(e).toEqual(new Error('Failed to delete personal API key'));
      }
    });
  });
});
