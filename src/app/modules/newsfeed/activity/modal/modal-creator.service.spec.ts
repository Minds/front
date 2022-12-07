import { ActivityModalCreatorService } from '../../activity-v2/modal/modal-creator.service';
import { ActivityV2ModalComponent } from '../../activity-v2/modal/modal.component';
import { ActivityEntity } from '../activity.service';

export let analyticsServiceMock = new (function() {
  this.getContexts = jasmine
    .createSpy('getContexts')
    .and.returnValue(undefined);
  this.buildEntityContext = jasmine
    .createSpy('buildEntityContext')
    .and.returnValue(null);
  this.trackClick = jasmine.createSpy('trackClick').and.returnValue(null);
})();

export let modalServiceMock = new (function() {
  this.canOpenInModal = jasmine
    .createSpy('canOpenInModal')
    .and.returnValue(true);
  this.present = jasmine.createSpy('present').and.returnValue(true);
})();

describe('ActivityModalCreatorService', () => {
  let service: ActivityModalCreatorService;

  const mockContext = {
    schema: 'iglu:com.minds/entity_context/jsonschema/1-0-0',
    data: {
      entity_guid: '123',
      entity_type: 'object',
      entity_subtype: 'video',
      entity_owner_guid: '123',
      entity_access_id: '2',
      entity_container_guid: '123',
    },
  };
  const eventKey = 'activity-modal-open';

  beforeEach(() => {
    service = new ActivityModalCreatorService(
      modalServiceMock,
      analyticsServiceMock
    );

    (service as any).analytics.buildEntityContext.calls.reset();
    (service as any).analytics.trackClick.calls.reset();
    (service as any).analytics.buildEntityContext.and.returnValue(mockContext);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should open the modal and not track events for activities', () => {
    const entity = {
      type: 'activity',
      subtype: '',
    };

    service.create(entity as ActivityEntity, null);

    expect(
      (service as any).analytics.buildEntityContext
    ).not.toHaveBeenCalled();
    expect((service as any).analytics.trackClick).not.toHaveBeenCalled();
    expect((service as any).modalService.present).toHaveBeenCalledWith(
      ActivityV2ModalComponent,
      {
        modalDialogClass: 'modal-fullwidth',
        size: 'xl',
        data: {
          entity,
          activeMultiImageIndex: 0,
        },
        injector: null,
      }
    );
  });

  it('should open the modal and track events for images', () => {
    const entity = {
      type: 'object',
      subtype: 'image',
    };

    service.create(entity as ActivityEntity, null);

    expect((service as any).analytics.buildEntityContext).toHaveBeenCalledWith(
      entity
    );
    expect((service as any).analytics.trackClick).toHaveBeenCalledWith(
      eventKey,
      [mockContext]
    );
    expect((service as any).modalService.present).toHaveBeenCalledWith(
      ActivityV2ModalComponent,
      {
        modalDialogClass: 'modal-fullwidth',
        size: 'xl',
        data: {
          entity,
          activeMultiImageIndex: 0,
        },
        injector: null,
      }
    );
  });

  it('should open the modal and track events for videos', () => {
    const entity = {
      type: 'object',
      subtype: 'video',
    };

    service.create(entity as ActivityEntity, null);

    expect((service as any).analytics.buildEntityContext).toHaveBeenCalledWith(
      entity
    );
    expect((service as any).analytics.trackClick).toHaveBeenCalledWith(
      eventKey,
      [mockContext]
    );
    expect((service as any).modalService.present).toHaveBeenCalledWith(
      ActivityV2ModalComponent,
      {
        modalDialogClass: 'modal-fullwidth',
        size: 'xl',
        data: {
          entity,
          activeMultiImageIndex: 0,
        },
        injector: null,
      }
    );
  });
});
