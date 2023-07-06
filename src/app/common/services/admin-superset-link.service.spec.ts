import { TestBed } from '@angular/core/testing';
import { AdminSupersetLinkService } from './admin-superset-link.service';

describe('AdminSupersetLinkService', () => {
  let service: AdminSupersetLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminSupersetLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the correct URL for user overview link', () => {
    const guid: string = 'test_guid';
    const expectedUrl: string = `https://superset.minds.com/superset/dashboard/AUserOverview/?preselect_filters={%2232%22:{%22USER_GUID%22:%22${guid}%22}}`;

    expect(service.getUserOverviewUrl(guid)).toEqual(expectedUrl);
  });
});
