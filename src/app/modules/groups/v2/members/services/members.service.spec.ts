import { TestBed } from '@angular/core/testing';

import { GroupMembersService } from './members.service';

describe('GroupMembersService', () => {
  let service: GroupMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupMembersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
