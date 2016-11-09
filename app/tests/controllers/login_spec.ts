// TODO: FIX THIS!
declare var
  AsyncTestCompleter,
  TestComponentBuilder,
  beforeEach,
  ddescribe,
  describe,
  el,
  expect,
  iit,
  inject,
  it,
  xit;
// import {
//   AsyncTestCompleter,
//   TestComponentBuilder,
//   beforeEach,
//   ddescribe,
//   describe,
//   el,
//   expect,
//   iit,
//   inject,
//   it,
//   xit
// } from '@angular/test';

import {Component} from '@angular/core';
// import {Component, ViewMetadata, UrlResolver, bind} from '@angular/core';
// import { HTTP_PROVIDERS } from '@angular/http';
// import { ROUTER_DIRECTIVES } from '@angular/router';

// import {DOM} from '@angular/src/core/dom/dom_adapter';
// import { Login as LoginComponent } from 'src/controllers/login';

export function main() {

  describe('Login[component]', () => {
    let builder: TestComponentBuilder;
    beforeEach(inject([TestComponentBuilder], (tcb) => { builder = tcb; }));

    it('should have login visible by default', inject([AsyncTestCompleter], (async) => {
      builder.createAsync(TestApp)
        .then((rootTC) => {
           var Login = rootTC.componentViewChildren[0].componentInstance;
           expect(Login.hideLogin).toEqual(false);
           async.done();
        })
        .catch((e) => {
          console.error(e);
          async.done();
        })
    }));

  });

};

@Component({
  selector: 'test-app',
  // directives: [ LoginComponent, ROUTER_DIRECTIVES ],
  template: `<base href="/" />
    <minds-app>
      <minds-login></minds-login>
    </minds-app>`
})
class TestApp {}
