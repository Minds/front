import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VjsPlayerComponent } from './vjs-player.component';
import { VideoJSCustomOptions } from './vjs-player.types';

describe('VjsPlayerComponent', () => {
  let comp: VjsPlayerComponent;
  let fixture: ComponentFixture<VjsPlayerComponent>;

  const initialOptions: VideoJSCustomOptions = {
    aspectRatio: '16:9',
    autoplay: true,
    muted: false,
    sources: [
      {
        src: '~src~',
        type: '~type~',
      },
    ],
    poster: '~posted~',
  };

  const playerMock: any = {
    dispose: jasmine.createSpy('dispose'),
    muted: jasmine.createSpy('muted'),
    play: jasmine.createSpy('play'),
    pause: jasmine.createSpy('pause'),
    paused: jasmine.createSpy('paused'),
    volume: jasmine.createSpy('volume'),
    on: jasmine.createSpy('on'),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VjsPlayerComponent],
      providers: [],
    }).compileComponents();
  }));

  beforeEach((done) => {
    fixture = TestBed.createComponent(VjsPlayerComponent);
    comp = fixture.componentInstance;

    (comp as any).options = initialOptions;
    (comp as any).player = playerMock;

    fixture.detectChanges();

    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        done();
      });
    }
  });

  it('should instantiate', () => {
    expect(comp).toBeTruthy();
  });

  it('should register event listeners', () => {
    (comp as any).player = playerMock;

    expect((comp as any).player.on).not.toHaveBeenCalled();

    (comp as any).registerEventListeners();

    expect((comp as any).player.on).toHaveBeenCalledTimes(6);
  });

  it('should dispose player on destroy', () => {
    (comp as any).player = playerMock;
    comp.ngOnDestroy();
    expect((comp as any).player.dispose).toHaveBeenCalled();
  });

  it('should check if player is muted', () => {
    ((comp as any).player = playerMock),
      (comp as any).player.muted.and.returnValue(true);
    expect(comp.isMuted()).toBeTrue();
    expect((comp as any).player.muted).toHaveBeenCalled();
  });

  it('should check if player is not muted', () => {
    ((comp as any).player = playerMock),
      (comp as any).player.muted.and.returnValue(false);
    expect(comp.isMuted()).toBeFalse();
    expect((comp as any).player.muted).toHaveBeenCalled();
  });

  it('should play manually', () => {
    ((comp as any).player = playerMock), comp.play();
    expect((comp as any).player.play).toHaveBeenCalled();
  });

  it('should pause manually', () => {
    ((comp as any).player = playerMock), comp.pause();
    expect((comp as any).player.pause).toHaveBeenCalled();
  });

  it('should check if player is playing', () => {
    ((comp as any).player = playerMock),
      (comp as any).player.paused.and.returnValue(false);
    expect(comp.isPlaying()).toBeTrue();
    expect((comp as any).player.paused).toHaveBeenCalled();
  });

  it('should check if player is not playing', () => {
    ((comp as any).player = playerMock),
      (comp as any).player.paused.and.returnValue(true);
    expect(comp.isPlaying()).toBeFalse();
    expect((comp as any).player.paused).toHaveBeenCalled();
  });

  it('should get volume', () => {
    const volume: number = 0.5;
    ((comp as any).player = playerMock),
      (comp as any).player.volume.and.returnValue(volume);
    expect(comp.getVolume()).toBe(volume);
    expect((comp as any).player.volume).toHaveBeenCalled();
  });
});
