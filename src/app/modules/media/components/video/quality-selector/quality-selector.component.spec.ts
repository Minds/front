///<reference path="../../../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component, DebugElement, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule as NgCommonModule } from '@angular/common';
import { MindsVideoQualitySelector } from './quality-selector.component';

describe('MindsVideoVolumeSlider', () => {
  let comp: MindsVideoQualitySelector;
  let fixture: ComponentFixture<MindsVideoQualitySelector>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [ MindsVideoQualitySelector ], // declare the test component
      imports: [ 
        FormsModule,
        RouterTestingModule,
        NgCommonModule ],
    })
      .compileComponents();  // compile template and css
  }));

  beforeEach((done) => {
    
    window.addEventListener = ()=>{};
    jasmine.MAX_PRETTY_PRINT_DEPTH = 10;
    jasmine.clock().uninstall();
    jasmine.clock().install();
    fixture = TestBed.createComponent(MindsVideoQualitySelector);
    comp = fixture.componentInstance;
    comp.src = [
        {'uri': 'aaaaaa/bbbbb/cccc/video.mp4'}, 
        {'uri': 'aaaaaa/bbbbb/cccc/video2.video'}, 
        {'uri': 'aaaaaa/bbbbb/cccc/video3.mpeg'}
    ];
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

  it('should render a hidden slider, should show as many options as there srcs, and first one should be selected', () => {
    const wrapper = fixture.debugElement.query(By.css('.m-video--quality-control-wrapper'));
    const control = fixture.debugElement.query(By.css('.m-video--quality-control'));
    const icon = fixture.debugElement.query(By.css('.material-icons'));
    const selectedOption = fixture.debugElement.query(By.css('.m-video--selected-quality'));
    expect(control).not.toBeNull();
    expect(icon).not.toBeNull();
    expect(wrapper).not.toBeNull();
    expect(selectedOption).not.toBeNull();
    expect(selectedOption.nativeElement.innerText).toBe('video');
  });

  it('should change quality', () => {
    const selectedOptions = fixture.debugElement.queryAll(By.css('li'));
    selectedOptions[1].nativeElement.click();
    fixture.detectChanges();
    const selectedOption = fixture.debugElement.query(By.css('.m-video--selected-quality'));
    expect(selectedOption).not.toBeNull();
    expect(selectedOption.nativeElement.innerText).toBe('video2');
  });
});
