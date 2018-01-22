///<reference path="../../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule as NgCommonModule } from '@angular/common';
import { Client } from '../../../../services/api';
import { clientMock } from '../../../../../tests/client-mock.spec';
import { ScrollService } from '../../../../services/ux/scroll';
import { scrollServiceMock } from '../../../../../tests/scroll-service-mock.spec';
import { VideoAdsService } from './ads.service';
import { MindsVideoComponent } from './video.component';
import { MindsVideoProgressBar } from './progress-bar/progress-bar.component';
import { MindsVideoQualitySelector } from './quality-selector/quality-selector.component';
import { MindsVideoVolumeSlider } from './volume-slider/volume-slider.component';


@Component({
  selector: 'm-video--volume-slider',
  template: ''
})
export class MindsVideoVolumeSliderMock {
  @Input() element;
}

@Component({
  selector: 'm-video--quality-selector',
  template: ''
})
export class MindsVideoQualitySelectorMock {
  @Input('src') src: Array<any>;
  @Output('selectedQuality') selectedQuality: EventEmitter<any> = new EventEmitter();
}

@Component({
  selector: 'm-video--progress-bar',
  template: ''
})
export class MindsVideoProgressBarMock {
  @Input() element;
  getSeeker(){
    
  }
}


describe('MindsVideo', () => {
  let comp: MindsVideoComponent;
  let fixture: ComponentFixture<MindsVideoComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ 
        MindsVideoQualitySelectorMock,
        MindsVideoProgressBarMock,
        MindsVideoVolumeSliderMock,
        MindsVideoComponent,
      ], // declare the test component
      imports: [ 
        FormsModule,
        RouterTestingModule,
        NgCommonModule,
       ],
      providers: [
        { provide: ScrollService, useValue: scrollServiceMock },
        { provide: Client, useValue: clientMock }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(MindsVideoComponent);
    clientMock.response = {};
    comp = fixture.componentInstance;
    comp.guid = '1';
    const video = document.createElement('video');
    video.src = 'thisisavideo.mp4';
    comp.element = video;
    comp.progressBar.getSeeker = () => {};
    fixture.detectChanges();
    if (fixture.isStable()) {
      done();
    } else {
      fixture.whenStable().then(() => {
        done();
      });
    }
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should have a Play icon and a Control bar', () => {
    const playIcon = fixture.debugElement.query(By.css('.minds-video-play-icon'));
    const videoBar = fixture.debugElement.query(By.css('.minds-video-bar-full'));
    expect(playIcon).not.toBeNull();
    expect(videoBar).not.toBeNull();
  });

  it('On hover Control bar should be visible', () => {
    const video = fixture.debugElement.query(By.css('video'));
    fixture.detectChanges();
    expect(video).not.toBeNull();
    video.nativeElement.dispatchEvent(new Event('hover'));
    const videoBar = fixture.debugElement.query(By.css('.minds-video-bar-full'));
    expect(videoBar.nativeElement.hasAttribute('hidden')).toEqual(false);
    const quality = fixture.debugElement.query(By.css('m-video--quality-selector'));
    const volume = fixture.debugElement.query(By.css('m-video--volume-slider'));
    const progressBar = fixture.debugElement.query(By.css('m-video--progress-bar'));
    expect(progressBar).not.toBeNull();
    expect(quality).toBeNull();
    expect(volume).not.toBeNull();
  });

  it('Should call counter', () => {
    const video = fixture.debugElement.query(By.css('video'));
    comp.playCountDisabled = false;
    comp.playCount = -1;
    comp.log = '1';
    fixture.detectChanges();
    const calls = clientMock.get['calls'];
    expect(calls.mostRecent().args[0]).toEqual('api/v1/analytics/@counter/play/1');
  });

  it('If error loading then try tro confirm that is being transcoded', () => {
    fixture.detectChanges();
    comp.onError();
    fixture.detectChanges();
    const calls = clientMock.get['calls'];
    expect(calls.mostRecent().args[0]).toEqual('api/v1/media/transcoding/1');
  });

  it('call play on togglepause', () => {
    comp.onClick();
    fixture.detectChanges();
    expect(comp.element.paused).toBe(false);
  });

  it('should set muted', () => {
    comp.muted = true;
    fixture.detectChanges();
    expect(comp.muted).toEqual(true);
  });

  it('should sets _autoplay', () => {
    comp._autoplay = false;
    fixture.detectChanges();
    expect(comp.autoplay).toEqual(false);
  });

  it('should sets src', () => {
    comp._src = [];
    fixture.detectChanges();
    expect(comp.src).toEqual([]);
  });

  it('should set loop', () => {
    comp.loop = true;
    fixture.detectChanges();
    expect(comp.loop).toEqual(true);
  });

  it('should sets visibleplay', () => {
    comp.visibleplay = false;
    fixture.detectChanges();
    expect(comp.visibleplay).toEqual(false);
  });

  it('should sets _playCount', () => {
    comp._playCount = 70;
    fixture.detectChanges();
    expect(comp.playCount).toEqual(70);
  });

  it('should sets _playCount in 0', () => {
    comp._playCount = false;
    fixture.detectChanges();
    expect(comp.playCountDisabled).toEqual(true);
  });

  it('Open Full Screen', () => {
    let e:any = {};
    e.preventDefault = () => {};
    e.keyCode = 39;
    spyOn(comp.element, 'webkitRequestFullscreen').and.callThrough();
    comp.openFullScreen(e);
    fixture.detectChanges();
    expect(comp.element.webkitRequestFullscreen).toHaveBeenCalled();
  });

  it('Should Select Quality, reloading and playing', () => {
    let e:any = {};
    e.reorderedSrc = [{},{}];
    e.currentTime = 39;
    spyOn(comp.element, 'load').and.callThrough();
    spyOn(comp.element, 'play').and.callThrough();
    comp.selectedQuality(e);
    fixture.detectChanges();
    expect(comp.element.load).toHaveBeenCalled();
    expect(comp.element.play).toHaveBeenCalled();
  });

  it('should set is visible', () => {
    comp.element.getBoundingClientRect = () => { 
      return {'top':1};
    }
    comp.scroll.view = {};
    comp.scroll.view.clientHeight = 10;
    comp.isVisible();
    fixture.detectChanges();
    expect(comp.element.muted).toEqual(false);
  });

  it('should set is visible', () => {
    comp.element.getBoundingClientRect = () => { 
      return {'top':100};
    }
    comp.scroll.view = {};
    comp.scroll.view.clientHeight = 10;
    comp.isVisible();
    fixture.detectChanges();
    expect(comp.element.muted).toEqual(false);
  });

  it('should set is visible', () => {
    comp.autoplay = true;
    comp.isVisible();
    fixture.detectChanges();
    expect(comp.isVisible()).toEqual(undefined);
  });
});
