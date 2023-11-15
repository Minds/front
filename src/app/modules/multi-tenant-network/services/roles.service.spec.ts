import { TestBed } from '@angular/core/testing';

import { MultiTenantRolesService } from './roles.service';
// ojm
describe('MultiTenantRolesService', () => {
  let service: MultiTenantRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiTenantRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
