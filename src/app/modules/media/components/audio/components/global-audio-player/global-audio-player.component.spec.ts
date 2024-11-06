import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalAudioPlayerComponent } from './global-audio-player.component';
import { GlobalAudioPlayerService } from '../../services/global-audio-player.service';
import { MockService } from '../../../../../../utils/mock';
import { BehaviorSubject } from 'rxjs';

describe('GlobalAudioPlayerComponent', () => {
  let comp: GlobalAudioPlayerComponent;
  let fixture: ComponentFixture<GlobalAudioPlayerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GlobalAudioPlayerComponent],
      providers: [
        {
          provide: GlobalAudioPlayerService,
          useValue: MockService(GlobalAudioPlayerService, {
            has: ['currentAudioSrc$'],
            props: {
              currentAudioSrc$: {
                get: () => new BehaviorSubject<string>(null),
              },
            },
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalAudioPlayerComponent);
    comp = fixture.componentInstance;
    (comp as any).globalAudioPlayerService.setAudioElement.and.returnValue(
      (comp as any).globalAudioPlayerService
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should initialize audio element after view init', () => {
    comp.ngAfterViewInit();
    expect(
      (comp as any).globalAudioPlayerService.setAudioElement
    ).toHaveBeenCalledWith(comp.audioElement);
    expect((comp as any).globalAudioPlayerService.init).toHaveBeenCalled();
  });
});
