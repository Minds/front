import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComposerRecordButtonComponent } from './record-button.component';
import { AudioRecordingService } from '../../../../common/services/audio-recording.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { CommonModule } from '@angular/common';
import { MockService } from '../../../../utils/mock';
import {
  AUDIO_PERMISSIONS_ERROR_MESSAGE,
  PermissionsService,
} from '../../../../common/services/permissions.service';
import { PlusUpgradeModalService } from '../../../wire/v2/plus-upgrade-modal.service';
import { Session } from '../../../../services/session';
import { IS_TENANT_NETWORK } from '../../../../common/injection-tokens/tenant-injection-tokens';

describe('ComposerRecordButtonComponent', () => {
  let comp: ComposerRecordButtonComponent;
  let fixture: ComponentFixture<ComposerRecordButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ComposerRecordButtonComponent],
      providers: [
        { provide: ToasterService, useValue: MockService(ToasterService) },
        {
          provide: PermissionsService,
          useValue: MockService(PermissionsService),
        },
        {
          provide: PlusUpgradeModalService,
          useValue: MockService(PlusUpgradeModalService),
        },
        { provide: Session, useValue: MockService(Session) },
        { provide: IS_TENANT_NETWORK, useValue: false },
      ],
    })
      .overrideProvider(AudioRecordingService, {
        useValue: MockService(AudioRecordingService),
      })
      .compileComponents();

    fixture = TestBed.createComponent(ComposerRecordButtonComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should init', () => {
    expect(comp).toBeTruthy();
  });

  describe('toggleRecord', () => {
    it('should start recording when not recording', async () => {
      (comp as any).permissionService.canUploadAudio.and.returnValue(true);
      (comp as any).audioRecordingService.startRecording.and.returnValue(
        Promise.resolve()
      );

      await (comp as any).toggleRecord();

      expect(
        (comp as any).audioRecordingService.startRecording
      ).toHaveBeenCalled();
      expect((comp as any).recording()).toBeTrue();
    });

    it('should stop recording and emit blob when recording', async () => {
      (comp as any).permissionService.canUploadAudio.and.returnValue(true);
      const testBlob: Blob = new Blob(['test']);
      (comp as any).audioRecordingService.stopRecording.and.returnValue(
        Promise.resolve(testBlob)
      );
      (comp as any).recording.set(true);

      spyOn((comp as any).recordingEndedEmitter, 'emit');

      await (comp as any).toggleRecord();

      expect(
        (comp as any).audioRecordingService.stopRecording
      ).toHaveBeenCalled();
      expect((comp as any).recordingEndedEmitter.emit).toHaveBeenCalledWith(
        testBlob
      );
      expect((comp as any).recording()).toBeFalse();
    });

    it('should handle errors and show toast', async () => {
      (comp as any).permissionService.canUploadAudio.and.returnValue(true);
      (comp as any).audioRecordingService.startRecording.and.throwError({
        message: 'Test error',
      });

      await (comp as any).toggleRecord();

      expect(
        (comp as any).audioRecordingService.startRecording
      ).toHaveBeenCalled();
      expect((comp as any).toastService.error).toHaveBeenCalledWith(
        'Test error'
      );
      expect((comp as any).recording()).toBeFalse();
    });
  });

  describe('handleAudioPermissionCheck', () => {
    it('should return true if the user has audio permissions', () => {
      (comp as any).permissionService.canUploadAudio.and.returnValue(true);
      expect((comp as any).handleAudioPermissionCheck()).toBeTrue();
    });

    it('should should a toast if the user does not have audio permissions and is on a tenant network', () => {
      (comp as any).permissionService.canUploadAudio.and.returnValue(false);
      Object.defineProperty(comp as any, 'isTenantNetwork', {
        value: true,
        writable: true,
      });

      expect((comp as any).handleAudioPermissionCheck()).toBeFalse();
      expect((comp as any).toastService.warn).toHaveBeenCalledWith(
        AUDIO_PERMISSIONS_ERROR_MESSAGE
      );
    });

    it('should should a toast if the user does not have audio permissions and is not on a tenant network, and is plus', () => {
      (comp as any).permissionService.canUploadAudio.and.returnValue(false);
      Object.defineProperty(comp as any, 'isTenantNetwork', {
        value: false,
        writable: true,
      });
      (comp as any).session.getLoggedInUser.and.returnValue({ plus: true });

      expect((comp as any).handleAudioPermissionCheck()).toBeFalse();
      expect((comp as any).toastService.warn).toHaveBeenCalledWith(
        AUDIO_PERMISSIONS_ERROR_MESSAGE
      );
    });

    it('should show a plus upgrade modal when the user is not on a tenant network and does not have audio permissions or plus', () => {
      (comp as any).permissionService.canUploadAudio.and.returnValue(false);
      Object.defineProperty(comp as any, 'isTenantNetwork', {
        value: false,
        writable: true,
      });
      (comp as any).session.getLoggedInUser.and.returnValue({ plus: false });

      expect((comp as any).handleAudioPermissionCheck()).toBeFalse();

      expect((comp as any).plusUpgradeModalService.open).toHaveBeenCalled();
      expect((comp as any).toastService.warn).toHaveBeenCalledWith(
        'Only Plus members can upload audio.'
      );
    });
  });
});
