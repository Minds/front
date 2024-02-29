import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { NetworkAdminConsoleInviteLinkComponent } from './link.component';
import { FormBuilder } from '@angular/forms';
import {
  GetSiteMembershipsGQL,
  GetSiteMembershipsQuery,
} from '../../../../../../../../graphql/generated.engine';
import { of } from 'rxjs';
import { ToasterService } from '../../../../../../../common/services/toaster.service';
import { ConfigsService } from '../../../../../../../common/services/configs.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TenantInviteLinkType } from '../../invite.types';
import { ApolloQueryResult } from '@apollo/client';
import { siteMembershipMock } from '../../../../../../../mocks/site-membership.mock';

describe('NetworkAdminConsoleInviteLinkComponent', () => {
  let component: NetworkAdminConsoleInviteLinkComponent;
  let fixture: ComponentFixture<NetworkAdminConsoleInviteLinkComponent>;
  let getSiteMembershipsGQLSpy: jasmine.SpyObj<GetSiteMembershipsGQL>;
  let toasterServiceSpy: jasmine.SpyObj<ToasterService>;
  let configsServiceSpy: jasmine.SpyObj<ConfigsService>;

  beforeEach(
    waitForAsync(() => {
      const getSiteMembershipsResponse: ApolloQueryResult<GetSiteMembershipsQuery> = {
        data: {
          siteMemberships: [siteMembershipMock],
        },
        loading: false,
        networkStatus: 7,
      };

      getSiteMembershipsGQLSpy = jasmine.createSpyObj('GetSiteMembershipsGQL', [
        'fetch',
      ]);
      getSiteMembershipsGQLSpy.fetch.and.returnValue(
        of(getSiteMembershipsResponse)
      );

      toasterServiceSpy = jasmine.createSpyObj('ToasterService', ['error']);
      configsServiceSpy = jasmine.createSpyObj('ConfigsService', ['get']);
      configsServiceSpy.get.and.returnValue('http://example.com');

      TestBed.configureTestingModule({
        declarations: [NetworkAdminConsoleInviteLinkComponent],
        providers: [
          FormBuilder,
          {
            provide: GetSiteMembershipsGQL,
            useValue: getSiteMembershipsGQLSpy,
          },
          { provide: ToasterService, useValue: toasterServiceSpy },
          { provide: ConfigsService, useValue: configsServiceSpy },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAdminConsoleInviteLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
