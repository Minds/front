import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscoveryAdminExcludeButtonComponent } from './admin-exclude-button.component';
import { DiscoveryTagsService } from '../tags.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { ExcludeHashtagGQL } from '../../../../../graphql/generated.engine';
import { ModalService } from '../../../../services/ux/modal.service';
import { ConfirmV2Component } from '../../../modals/confirm-v2/confirm.component';
import { of } from 'rxjs';
import { MockComponent, MockService } from '../../../../utils/mock';

describe('DiscoveryAdminExcludeButtonComponent', () => {
  let comp: DiscoveryAdminExcludeButtonComponent;
  let fixture: ComponentFixture<DiscoveryAdminExcludeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DiscoveryAdminExcludeButtonComponent,
        MockComponent({
          selector: 'm-button',
          inputs: ['color', 'size', 'iconOnly'],
          outputs: ['onAction'],
        }),
      ],
      providers: [
        {
          provide: ExcludeHashtagGQL,
          useValue: jasmine.createSpyObj<ExcludeHashtagGQL>(['mutate']),
        },
        {
          provide: DiscoveryTagsService,
          useValue: MockService(DiscoveryTagsService),
        },
        { provide: ModalService, useValue: MockService(ModalService) },
        { provide: ToasterService, useValue: MockService(ToasterService) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoveryAdminExcludeButtonComponent);
    comp = fixture.componentInstance;
    (comp as any).tag = { value: 'testTag' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  describe('onExcludeTagClick', () => {
    it('should present a confirmation modal', async () => {
      const mockEvent = jasmine.createSpyObj('MouseEvent', [
        'preventDefault',
        'stopPropagation',
      ]);
      const mockModalRef = { close: jasmine.createSpy('close') };
      (comp as any).modalService.present.and.returnValue(mockModalRef);

      await (comp as any).onExcludeTagClick(mockEvent, { value: 'testTag' });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(TestBed.inject(ModalService).present).toHaveBeenCalledWith(
        ConfirmV2Component,
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            title: 'Hide this hashtag?',
            confirmButtonText: 'Hide',
          }),
        })
      );
    });

    it('should call excludeHashtag when modal is confirmed', async () => {
      const mockEvent = jasmine.createSpyObj('MouseEvent', [
        'preventDefault',
        'stopPropagation',
      ]);
      const mockModalRef = { close: jasmine.createSpy('close') };
      (comp as any).modalService.present.and.returnValue(mockModalRef);
      (comp as any).excludeHashtagGQL.mutate.and.returnValue(
        of({ data: { excludeHashtag: true } })
      );

      await (comp as any).onExcludeTagClick(mockEvent, { value: 'testTag' });

      // Simulate modal confirmation
      const presentCall = (comp as any).modalService.present.calls.mostRecent();
      const onConfirm = presentCall.args[1].data.onConfirm;
      await onConfirm();

      expect(mockModalRef.close).toHaveBeenCalled();
      expect((comp as any).excludeHashtagGQL.mutate).toHaveBeenCalledWith({
        hashtag: 'testTag',
      });
      expect(
        (comp as any).discoveryTagsService.removeTagFromTrending
      ).toHaveBeenCalledWith({ value: 'testTag' });
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        '#testTag excluded successfully'
      );
    });
  });

  describe('excludeHashtag', () => {
    it('should handle successful exclusion', async () => {
      (comp as any).excludeHashtagGQL.mutate.and.returnValue(
        of({ data: { excludeHashtag: true } })
      );

      await (comp as any).excludeHashtag({ value: 'testTag' });

      expect((comp as any).excludeHashtagGQL.mutate).toHaveBeenCalledWith({
        hashtag: 'testTag',
      });
      expect(
        (comp as any).discoveryTagsService.removeTagFromTrending
      ).toHaveBeenCalledWith({ value: 'testTag' });
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        '#testTag excluded successfully'
      );
    });

    it('should handle failed exclusion', async () => {
      (comp as any).excludeHashtagGQL.mutate.and.returnValue(
        of({ data: { excludeHashtag: false } })
      );

      await (comp as any).excludeHashtag({ value: 'testTag' });

      expect((comp as any).excludeHashtagGQL.mutate).toHaveBeenCalledWith({
        hashtag: 'testTag',
      });
      expect(
        (comp as any).discoveryTagsService.removeTagFromTrending
      ).not.toHaveBeenCalled();
      expect((comp as any).toaster.success).toHaveBeenCalledWith(
        'Failed to exclude #testTag'
      );
    });

    it('should handle errors', async () => {
      (comp as any).excludeHashtagGQL.mutate.and.throwError('Test error');

      await (comp as any).excludeHashtag({ value: 'testTag' });

      expect((comp as any).excludeHashtagGQL.mutate).toHaveBeenCalledWith({
        hashtag: 'testTag',
      });
      expect(
        (comp as any).discoveryTagsService.removeTagFromTrending
      ).not.toHaveBeenCalled();
      expect((comp as any).toaster.success).not.toHaveBeenCalled();
    });
  });
});
