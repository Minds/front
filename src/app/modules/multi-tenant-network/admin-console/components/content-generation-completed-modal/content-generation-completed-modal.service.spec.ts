import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ContentGenerationCompletedModalService } from './content-generation-completed-modal.service';
import { ModalService } from '../../../../../services/ux/modal.service';
import { ContentGenerationCompletedModalComponent } from './content-generation-completed-modal.component';
import { MockService } from '../../../../../utils/mock';

describe('ContentGenerationCompletedModalService', () => {
  let service: ContentGenerationCompletedModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ContentGenerationCompletedModalService,
        { provide: ModalService, useValue: MockService(ModalService) },
      ],
    });

    service = TestBed.inject(ContentGenerationCompletedModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('open', () => {
    it('should present the modal with correct configuration', fakeAsync(() => {
      const mockModalRef = { close: jasmine.createSpy('close') };
      (service as any).modalService.present.and.returnValue(mockModalRef);

      service.open();
      tick();

      expect((service as any).modalService.present).toHaveBeenCalledWith(
        ContentGenerationCompletedModalComponent,
        {
          data: {
            onSaveIntent: jasmine.any(Function),
            onDismissIntent: jasmine.any(Function),
          },
          size: 'md',
        }
      );
    }));
  });
});
