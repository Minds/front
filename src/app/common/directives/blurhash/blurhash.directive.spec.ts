import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { Component } from '@angular/core';
import { BlurhashDirective } from './blurhash.directive';

// TEST CASES:
//
// [x] blurhash with string
// [ ] blurhash with actvity
// [ ] blurhash with activity with normal blurhash
// [ ] blurhash with activity with custom_data blurhash
// [x] bluhash fullscreen
// [ ] bluhash non fullscreen
// [ ] blurhash with paywalled
// [ ] blurhash already loaded
// [ ] blurhash not loaded
// [ ] don't draw canvas if already have one
// [ ] handle empty entities
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
});
