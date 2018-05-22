import { Component, Directive, EventEmitter } from '@angular/core';

export function Mock(opts: any = {}) {
  return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) => {
      console.log(descriptor);
      return descriptor;
  };
}

export function MockComponent(options: Component, spies: string[] = []) {
  let metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    inputs: options.inputs,
    outputs: options.outputs
  };
  let component = class _ {};
  if (options.outputs) {
    for (let output of options.outputs) {
      component.prototype[output] = new EventEmitter<any>();
    }
  }
  for (let spy of spies) {
    component.prototype[spy] = jasmine.createSpy(spy);
  }
  return Component(metadata)(component);
}

export function MockDirective(options: Directive, spies: string[] = []) {
  let metadata: Directive = {
    selector: options.selector,
    inputs: options.inputs,
    outputs: options.outputs
  };
  let directive = class _ {};
  if (options.outputs) {
    for (let output of options.outputs) {
      directive.prototype[output] = new EventEmitter<any>();
    }
  }
  for (let spy of spies) {
    directive.prototype[spy] = jasmine.createSpy(spy);
  }
  return Directive(metadata)(directive);
}

export function MockService(obj: any, config: any = null) {
  let spies = {};
  const keys = Object.keys(obj.prototype);
  for (let key of keys) {
    let value = null;
    if (config && config[key]) {
      value = config[key];
    }
    spies[key] = jasmine.createSpy(key).and.returnValue(value);
  }
  return new Proxy({ ...spies, _config: config }, {
    get: (target, prop) => {
      //if spy exists, return it
      if (target.hasOwnProperty(prop.toString())) {
        return target[prop];
      } else if (prop.toString() === '$quoted$') {
        return [];
      }

      // if a custom return value exists, create a spy and then return it
      if (target['_config'] && target['_config'][prop]) {
        target[prop] = jasmine.createSpy(prop.toString()).and.returnValue(target['_config'][prop]);

        return target[prop];
      }
      return null;
    },
    set: (target, prop, value, receiver) => {
      target[prop] = jasmine.createSpy(prop.toString()).and.returnValue(value);
      return true;
    }
  });

}