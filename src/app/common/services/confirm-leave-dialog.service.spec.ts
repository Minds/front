import { TestBed } from '@angular/core/testing';
import { DialogService } from './confirm-leave-dialog.service';

describe('DialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialogService = TestBed.inject(DialogService);
    expect(service).toBeTruthy();
  });
});
