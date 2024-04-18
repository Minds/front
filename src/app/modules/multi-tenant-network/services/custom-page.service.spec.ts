import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CustomPageService } from './custom-page.service';
import {
  CustomPageTypesEnum,
  GetCustomPageGQL,
  SetCustomPageGQL,
  SetCustomPageMutation,
} from '../../../../graphql/generated.engine';
import { of, take } from 'rxjs';
import { ToasterService } from '../../../common/services/toaster.service';
import { MockService } from '../../../utils/mock';
import {
  CustomPageImplementation,
  CustomPageType,
} from '../../custom-pages/custom-pages.types';
import { ApolloQueryResult } from '@apollo/client';
import { MutationResult } from 'apollo-angular';

describe('CustomPageService', () => {
  let service: CustomPageService;
  let getCustomPageGQLMock: jasmine.SpyObj<GetCustomPageGQL>;
  let setCustomPageGQLMock: jasmine.SpyObj<SetCustomPageGQL>;

  beforeEach(() => {
    getCustomPageGQLMock = jasmine.createSpyObj<GetCustomPageGQL>(['fetch']);
    setCustomPageGQLMock = jasmine.createSpyObj<SetCustomPageGQL>(['mutate']);

    TestBed.configureTestingModule({
      providers: [
        CustomPageService,
        {
          provide: GetCustomPageGQL,
          useValue: getCustomPageGQLMock,
        },
        {
          provide: SetCustomPageGQL,
          useValue: setCustomPageGQLMock,
        },
        {
          provide: ToasterService,
          useValue: MockService(ToasterService),
        },
      ],
    });

    service = TestBed.inject(CustomPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  //
  describe('fetchCustomPage', () => {
    it('should fetch and process a custom page', fakeAsync(() => {
      const mockPage = {
        pageType: CustomPageTypesEnum.PrivacyPolicy,
        content: 'Privacy Policy Content',
        externalLink: null,
        defaultContent: 'Default Privacy Policy Content',
      };
      const mockResult: ApolloQueryResult<any> = {
        data: { customPage: mockPage },
        loading: false,
        networkStatus: 7,
      };

      getCustomPageGQLMock.fetch.and.returnValue(of(mockResult));

      service.fetchCustomPage(CustomPageType.PRIVACY_POLICY);

      tick();

      service.customPage$.pipe(take(1)).subscribe((customPageExtended) => {
        expect(customPageExtended).toEqual(
          jasmine.objectContaining({
            content: 'Privacy Policy Content',
            defaultContent: 'Default Privacy Policy Content',
            implementation: CustomPageImplementation.CUSTOM,
            displayName: 'privacy policy',
            displayContent: 'Privacy Policy Content',
          })
        );
      });
    }));
  });

  //
  describe('setCustomPage', () => {
    it('should update a custom page', fakeAsync(() => {
      const pageType: CustomPageType = CustomPageType.PRIVACY_POLICY;
      const content = 'New Terms of Service Content';
      const externalLink = 'https://example.com/terms';

      const mutationVariables = {
        pageType,
        content,
        externalLink,
      };

      const options = {
        refetchQueries: [
          {
            query: jasmine.anything(),
            variables: {
              pageType: pageType,
            },
          },
        ],
      };

      const mockResult: MutationResult<SetCustomPageMutation> = {
        data: { setCustomPage: true },
        loading: false,
      };

      setCustomPageGQLMock.mutate.and.returnValue(of(mockResult));

      service
        .setCustomPage(pageType, content, externalLink)
        .pipe(take(1))
        .subscribe((success) => {
          expect(success).toBeTrue();
          expect(setCustomPageGQLMock.mutate).toHaveBeenCalledWith(
            jasmine.objectContaining(mutationVariables),
            jasmine.objectContaining({
              refetchQueries: [
                {
                  query: undefined,
                  variables: { pageType: pageType },
                },
              ],
            })
          );
        });

      tick();
    }));
  });
  //
  describe('getDisplayName', () => {
    it('should return the correct display name for Privacy Policy', () => {
      expect(service.getDisplayName(CustomPageTypesEnum.PrivacyPolicy)).toEqual(
        'privacy policy'
      );
    });

    it('should return the correct display name for Terms Of Service', () => {
      expect(
        service.getDisplayName(CustomPageTypesEnum.TermsOfService)
      ).toEqual('terms of service');
    });

    it('should return the correct display name for Community Guidelines', () => {
      expect(
        service.getDisplayName(CustomPageTypesEnum.CommunityGuidelines)
      ).toEqual('community guidelines');
    });
  });
  //
  describe('getImplementation', () => {
    it('should return CUSTOM when content is provided without external link', () => {
      const customPage = {
        content: 'Some Content',
        externalLink: null,
        defaultContent: 'Default Privacy Policy Content',
        id: 'some-id',
        pageType: CustomPageTypesEnum.PrivacyPolicy,
      };
      expect(service.getImplementation(customPage)).toEqual(
        CustomPageImplementation.CUSTOM
      );
    });

    it('should return EXTERNAL when external link is provided without content', () => {
      const customPage = {
        content: null,
        externalLink: 'https://example.com',
        defaultContent: 'Default Privacy Policy Content',
        id: 'some-id',
        pageType: CustomPageTypesEnum.PrivacyPolicy,
      };
      expect(service.getImplementation(customPage)).toEqual(
        CustomPageImplementation.EXTERNAL
      );
    });

    it('should return DEFAULT when both content and external link are not provided', () => {
      const customPage = {
        content: null,
        externalLink: null,
        defaultContent: 'Default Privacy Policy Content',
        id: 'some-id',
        pageType: CustomPageTypesEnum.PrivacyPolicy,
      };
      expect(service.getImplementation(customPage)).toEqual(
        CustomPageImplementation.DEFAULT
      );
    });
  });
  //
  describe('getDisplayContent', () => {
    it('should return content for CUSTOM implementation', () => {
      const customPage = {
        content: 'Custom Content',
        externalLink: null,
        defaultContent: 'Default Privacy Policy Content',
        id: 'some-id',
        pageType: CustomPageTypesEnum.PrivacyPolicy,
      };
      expect(
        service.getDisplayContent(customPage, CustomPageImplementation.CUSTOM)
      ).toEqual('Custom Content');
    });

    it('should return null for EXTERNAL implementation', () => {
      const customPage = {
        content: null,
        externalLink: 'https://example.com',
        defaultContent: 'Default Privacy Policy Content',
        id: 'some-id',
        pageType: CustomPageTypesEnum.PrivacyPolicy,
      };
      expect(
        service.getDisplayContent(customPage, CustomPageImplementation.EXTERNAL)
      ).toBeNull();
    });

    it('should return default content for DEFAULT implementation based on page type', () => {
      const customPage = {
        content: null,
        externalLink: null,
        defaultContent: 'Default Privacy Policy Content',
        id: 'some-id',
        pageType: CustomPageTypesEnum.PrivacyPolicy,
      };
      expect(
        service.getDisplayContent(customPage, CustomPageImplementation.DEFAULT)
      ).toEqual('Default Privacy Policy Content');
    });
  });
});
