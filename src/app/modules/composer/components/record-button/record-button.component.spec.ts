import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComposerRecordButtonComponent } from './record-button.component';
import { AudioRecordingService } from '../../../../common/services/audio-recording.service';
import { ToasterService } from '../../../../common/services/toaster.service';
import { CommonModule } from '@angular/common';
import { MockService } from '../../../../utils/mock';

describe('ComposerRecordButtonComponent', () => {
  let comp: ComposerRecordButtonComponent;
  let fixture: ComponentFixture<ComposerRecordButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ComposerRecordButtonComponent],
      providers: [
        { provide: ToasterService, useValue: MockService(ToasterService) },
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
});
