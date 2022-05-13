import { ActivityV2ModalComponent } from '../../activity-v2/modal/modal.component';
import { ActivityEntity } from '../activity.service';
import { ActivityModalCreatorService } from './modal-creator.service';

export let activityV2ExperimentServiceMock = new (function() {
  this.isActive = jasmine.createSpy('isActive').and.returnValue(true);
})();

export let analyticsServiceMock = new (function() {
  this.getContexts = jasmine
    .createSpy('getContexts')
    .and.returnValue(undefined);
})();

export let modalServiceMock = new (function() {
  this.canOpenInModal = jasmine
    .createSpy('canOpenInModal')
    .and.returnValue(true);
  this.present = jasmine.createSpy('present').and.returnValue(true);
})();

describe('ActivityModalCreatorService', () => {
  let service: ActivityModalCreatorService;

  beforeEach(() => {
    service = new ActivityModalCreatorService(
      modalServiceMock,
      activityV2ExperimentServiceMock,
      analyticsServiceMock
    );
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should instantiate', () => {
    expect(service).toBeTruthy();
  });

  it('should open the modal and not track events for activities', () => {
    (service as any).analytics.getContexts.calls.reset();

    const entity = {
      type: 'activity',
      subtype: '',
    };

    service.create(entity as ActivityEntity, null);

    // can't check snowplow sdk so check the analytics call made in the function.
    expect((service as any).analytics.getContexts).not.toHaveBeenCalled();
    expect((service as any).modalService.present).toHaveBeenCalledWith(
      ActivityV2ModalComponent,
      {
        modalDialogClass: 'modal-fullwidth',
        size: 'xl',
        data: {
          entity,
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

    // can't check snowplow sdk so check the analytics call made in the function.
    expect((service as any).analytics.getContexts).toHaveBeenCalled();
    expect((service as any).modalService.present).toHaveBeenCalledWith(
      ActivityV2ModalComponent,
      {
        modalDialogClass: 'modal-fullwidth',
        size: 'xl',
        data: {
          entity,
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

    // can't check snowplow sdk so check the analytics call made in the function.
    expect((service as any).analytics.getContexts).toHaveBeenCalled();
    expect((service as any).modalService.present).toHaveBeenCalledWith(
      ActivityV2ModalComponent,
      {
        modalDialogClass: 'modal-fullwidth',
        size: 'xl',
        data: {
          entity,
        },
        injector: null,
      }
    );
  });
});
