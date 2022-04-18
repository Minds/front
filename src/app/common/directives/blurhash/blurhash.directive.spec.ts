import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Component } from '@angular/core';
import { BlurhashDirective } from './blurhash.directive';

// TEST CASES:
//
// [x] blurhash with string
// [ ] blurhash with actvity
// [ ] blurhash with activity with custom_data blurhash
// [x] bluhash fullscreen
// [ ] bluhash non fullscreen
// [ ] blurhash with paywalled
// [ ] blurhash already loaded
// [ ] blurhash not loaded
// [ ] don't draw canvas if already have one
// [x] handle empty and corrupted entities
// [ ] SSR handling
// [ ] blurhash without dimensions shouldn't render

@Component({
  selector: 'test-component',
  template: `
    <img
      src="https://fakeimg.pl/300/"
      [m-blurhash]="'LEHV6nWB2yk8pyo0adR*.7kCMdnj'"
      [m-blurhashFullscreen]="true"
      class="blurhash-with-string"
      width="100px"
      height="100px"
    />

    <img
      src="https://fakeimg.pl/300/"
      [m-blurhash]="null"
      [m-blurhashFullscreen]="true"
      class="empty-entity"
      width="100px"
      height="100px"
    />
    <img
      src="https://fakeimg.pl/300/"
      [m-blurhash]="{}"
      [m-blurhashFullscreen]="true"
      class="empty-object-entity"
      width="100px"
      height="100px"
    />
    <img
      src="https://fakeimg.pl/300/"
      [m-blurhash]="{ custom_data: null }"
      [m-blurhashFullscreen]="true"
      class="empty-custom-data"
      width="100px"
      height="100px"
    />
    <img
      src="https://fakeimg.pl/300/"
      [m-blurhash]="{ custom_data: [{ someFakeData: null }] }"
      [m-blurhashFullscreen]="true"
      class="empty-custom-data-children"
      width="100px"
      height="100px"
    />
  `,
})
class BlurhashFakeImageComponent {}

describe('BlurhashDirective', () => {
  let component: BlurhashFakeImageComponent;
  let fixture: ComponentFixture<BlurhashFakeImageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BlurhashDirective, BlurhashFakeImageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BlurhashFakeImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector(
      '.blurhash-with-string + canvas'
    );
    expect(canvas).toBeTruthy();
  });

  it('should not render anything if entity is corrupted', () => {
    expect(
      fixture.nativeElement.querySelector('.empty-entity + canvas')
    ).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector('.empty-object-entity + canvas')
    ).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector('.empty-custom-data + canvas')
    ).toBeFalsy();
    expect(
      fixture.nativeElement.querySelector(
        '.empty-custom-data-children + canvas'
      )
    ).toBeFalsy();
  });
});
