import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Injector, PLATFORM_ID } from '@angular/core';
import { ModalService } from '../../../../../../../services/ux/modal.service';
import { MockService } from '../../../../../../../utils/mock';
import { AddFeaturedEntityModalLazyService } from './add-featured-entity-modal-lazy.service';
import { AddFeaturedEntityModalEntityType } from './add-featured-entity-modal.types';
import { AddFeaturedEntityModalComponent } from './add-featured-entity-modal.component';

describe('GiftRecipientModalLazyService', () => {
  let service: AddFeaturedEntityModalLazyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AddFeaturedEntityModalLazyService,
        {
          provide: ModalService,
          useValue: MockService(ModalService),
        },
        {
          provide: PLATFORM_ID,
          useValue: 'browser',
        },
        Injector,
      ],
    });

    service = TestBed.inject(AddFeaturedEntityModalLazyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('open', () => {
    it('should open the modal with User entityType', fakeAsync(() => {
      const entityType: AddFeaturedEntityModalEntityType =
        AddFeaturedEntityModalEntityType.User;

      service.open(entityType);
      tick();

      expect((service as any).modalService.present).toHaveBeenCalledWith(
        AddFeaturedEntityModalComponent,
        jasmine.objectContaining({
          size: 'md',
          data: jasmine.objectContaining({
            entityType: entityType,
          }),
        })
      );
    }));

    it('should open the modal with Group entityType', fakeAsync(() => {
      const entityType: AddFeaturedEntityModalEntityType =
        AddFeaturedEntityModalEntityType.Group;

      service.open(entityType);
      tick();

      expect((service as any).modalService.present).toHaveBeenCalledWith(
        AddFeaturedEntityModalComponent,
        jasmine.objectContaining({
          size: 'md',
          data: jasmine.objectContaining({
            entityType: entityType,
          }),
        })
      );
    }));
  });
});
