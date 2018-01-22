///<reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MindsVideoProgressBar } from './progress-bar.component';

describe('MindsVideoProgressBar', () => {
  let comp: MindsVideoProgressBar;
  let fixture: ComponentFixture<MindsVideoProgressBar>;
  let window: any = {};
  let e: Event;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ MindsVideoProgressBar ], // declare the test component
      imports: [ 
        FormsModule,
        RouterTestingModule,
        NgCommonModule ],
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach((done) => {
    window.removeEventListener = ()=>{};
    window.addEventListener = ()=>{};
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(MindsVideoProgressBar);
    comp = fixture.componentInstance;
    const video = document.createElement('video');
    video.src = 'thisisavideo.mp4';
    comp.element = video;
    spyOn(window, 'removeEventListener').and.stub();
    spyOn(window, 'addEventListener').and.stub();
    spyOn(comp.element, 'addEventListener').and.stub();
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
    const seeker = fixture.debugElement.query(By.css('#seeker'));
    const seekerBall = fixture.debugElement.query(By.css('.seeker-ball'));
    const stamps = fixture.debugElement.query(By.css('.progress-stamps'));
    expect(seeker).not.toBeNull();
    expect(seekerBall).not.toBeNull();
    expect(stamps).not.toBeNull();
  });

  it('time is properly calculated', () => {
    comp.duration = 111;
    comp.calculateTime();
    fixture.detectChanges();
    expect(comp.time).toEqual({minutes:'01', seconds:51});
  });

  it('time is properly calculated', () => {
    comp.duration = 113;
    comp.element.currentTime = 111;
    comp.calculateElapsed();
    fixture.detectChanges();
    expect(comp.time).toEqual({minutes:'00', seconds:'00'});
  });

  it('time is properly calculated', () => {
    comp.duration = 9;
    comp.calculateTime();
    fixture.detectChanges();
    expect(comp.time).toEqual({minutes:'00', seconds:'09'});
  });

  it('time is properly calculated', () => {
    comp.duration = 9;
    comp.element.currentTime = 9;
    comp.calculateElapsed();
    fixture.detectChanges();
    expect(comp.time).toEqual({minutes:'00', seconds:'00'});
  });

  it('call play on togglepause', () => {
    spyOn(comp.element, 'play').and.callThrough();
    comp.togglePause();
    fixture.detectChanges();
    expect(comp.element.play).toHaveBeenCalled();
  });

  it('moves over time depending on the event', () => {
    comp.element.currentTime = 11;
    fixture.detectChanges();
    comp.moveToTime(2);
    fixture.detectChanges();
    expect(comp.element.currentTime).toBe(13);
  });

  it('execute control should call controls', () => {
    comp.element.currentTime = 11;
    fixture.detectChanges();
    let e:any = {};
    e.preventDefault = () => {};
    e.keyCode = 37;
    comp.executeControl(e);
    fixture.detectChanges();
    expect(comp.element.currentTime).toBe(9);
  });

  it('execute control should call controls', () => {
    comp.element.currentTime = 11;
    fixture.detectChanges();
    let e:any = {};
    e.preventDefault = () => {};
    e.keyCode = 39;
    comp.executeControl(e);
    fixture.detectChanges();
    expect(comp.element.currentTime).toBe(13);
  });

  it('execute control should call controls', () => {
    comp.element.currentTime = 11;
    spyOn(comp.element, 'play').and.callThrough();
    fixture.detectChanges();
    let e:any = {};
    e.preventDefault = () => {};
    e.keyCode = 32;
    comp.executeControl(e);
    fixture.detectChanges();
    expect(comp.element.play).toHaveBeenCalled();
  });

  it('should calculate remaining', () => {
    comp.element.currentTime = 11;
    comp.duration = 111;
    fixture.detectChanges();
    comp.calculateRemaining();
    fixture.detectChanges();
    expect(comp.remaining).toBeNull();
  });

  it('should calculate remaining', () => {
    comp.element.currentTime = 3;
    comp.duration = 111;
    fixture.detectChanges();
    comp.calculateRemaining();
    fixture.detectChanges();
    expect(comp.elapsed).toEqual({minutes:'00', seconds:'00'});
  });

  it('should calculate elapsed', () => {
    comp.element.currentTime = 11;
    comp.duration = 111;
    fixture.detectChanges();
    comp.calculateElapsed();
    fixture.detectChanges();
    expect(comp.elapsed).toEqual({minutes:'00', seconds:11});
  });
  
});
