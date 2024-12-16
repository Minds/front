import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AudioRecordingService } from './audio-recording.service';
import { WINDOW } from '../injection-tokens/common-injection-tokens';

describe('AudioRecordingService', () => {
  let service: AudioRecordingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AudioRecordingService,
        {
          provide: WINDOW,
          useValue: {
            navigator: {
              mediaDevices: {
                getUserMedia: jasmine
                  .createSpy('getUserMedia')
                  .and.returnValue(new MediaStream()),
              },
            },
          },
        },
      ],
    });
    service = TestBed.inject(AudioRecordingService);
  });

  it('should init', () => {
    expect(service).toBeTruthy();
  });

  describe('startRecording', () => {
    it('should start recording when permissions granted', fakeAsync(() => {
      const testBlob = new Blob(['test']);

      spyOn(service as any, 'buildMediaRecorder').and.returnValue({
        start: jasmine.createSpy('start'),
      });

      service.startRecording();
      tick();

      expect(
        (service as any).window.navigator.mediaDevices.getUserMedia
      ).toHaveBeenCalled();

      (service as any).mediaRecorder.ondataavailable({ data: testBlob });
      expect((service as any).chunks).toEqual([testBlob]);
    }));

    it('should throw more user-friendly error when permissions not allowed', async () => {
      spyOn(service as any, 'getUserMediaStream').and.throwError({
        name: 'NotAllowedError',
        message: 'Not allowed',
      });
      await expectAsync(service.startRecording()).toBeRejectedWith(
        new Error('Unable to record. Please check your browser permissions.')
      );
    });

    it('should throw out other errors', async () => {
      const error: Error = { name: 'OtherError', message: 'Other error' };
      spyOn(service as any, 'getUserMediaStream').and.throwError(error);
      await expectAsync(service.startRecording()).toBeRejectedWith(error);
    });
  });

  describe('getUserMediaStream', () => {
    it('should return media stream when available', async () => {
      const stream = await (service as any).getUserMediaStream();
      expect(stream).toBeTruthy();
    });

    it('should throw error when media devices not supported', async () => {
      (service as any).window.navigator = null;
      await expectAsync((service as any).getUserMediaStream()).toBeRejectedWith(
        new Error('Unable to access any devices')
      );
    });

    it('should throw error when no devices found', async () => {
      (service as any).window.navigator.mediaDevices.getUserMedia = () => null;
      await expectAsync((service as any).getUserMediaStream()).toBeRejectedWith(
        new Error('Could not find any devices')
      );
    });
  });

  describe('stopRecording', () => {
    it('should stop recording and return blob', async () => {
      (service as any).mediaRecorder = jasmine.createSpyObj('mediaRecorder', {
        stop: jasmine.createSpy('stop'),
      });
      Object.defineProperty((service as any).mediaRecorder, 'onstop', {
        set(spyFn: Function) {
          spyFn();
        },
      });

      spyOn(service as any, 'validateAudioLength').and.returnValue(
        Promise.resolve(true)
      );

      const testBlob = new Blob(['test']);
      (service as any).chunks = [testBlob];

      await expectAsync(service.stopRecording()).toBeResolvedTo(testBlob);
    });
  });

  describe('buildMediaRecorder', () => {
    it('should build media recorder', () => {
      const mediaRecorder = (service as any).buildMediaRecorder(
        new MediaStream()
      );
      expect(mediaRecorder).toBeTruthy();
    });
  });

  describe('reset', () => {
    it('should reset the media recorder and chunks', () => {
      const stopTrackSpy = jasmine.createSpy('stop');
      (service as any).mediaRecorder = {
        stop: jasmine.createSpy('stop'),
        stream: {
          getAudioTracks: jasmine.createSpy('getAudioTracks').and.returnValue([
            {
              stop: stopTrackSpy,
            },
          ]),
        },
      };
      (service as any).chunks = [new Blob(['test'])];

      (service as any).reset();

      expect(stopTrackSpy).toHaveBeenCalled();
      expect((service as any).mediaRecorder).toBeNull();
      expect((service as any).chunks).toEqual([]);
    });
  });
});
