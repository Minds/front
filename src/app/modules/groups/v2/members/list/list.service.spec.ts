import { TestBed } from '@angular/core/testing';

import { GroupMembersListService } from './list.service';

describe('GroupMembersListService', () => {
  let service: GroupMembersListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupMembersListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
