import { Component, Directive, EventEmitter } from '@angular/core';
import { SiteService } from '../common/services/site.service';

export function Mock(opts: any = {}) {
  return (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    console.log(descriptor);
    return descriptor;
  };
}

export function MockComponent(options: Component, spies: string[] = []) {
  const metadata: Component = {
    selector: options.selector,
    template: options.template || '',
    inputs: options.inputs,
    outputs: options.outputs,
  };
  const component = class _ {};
  if (options.outputs) {
    for (const output of options.outputs) {
      component.prototype[output] = new EventEmitter<any>();
    }
  }
  for (const spy of spies) {
    component.prototype[spy] = jasmine.createSpy(spy);
  }
  return Component(metadata)(component);
}

export function MockDirective(options: Directive, spies: string[] = []) {
  const metadata: Directive = {
    selector: options.selector,
    inputs: options.inputs,
    outputs: options.outputs,
  };
  const directive = class _ {};
  if (options.outputs) {
    for (const output of options.outputs) {
      directive.prototype[output] = new EventEmitter<any>();
    }
  }
  for (const spy of spies) {
    directive.prototype[spy] = jasmine.createSpy(spy);
  }
  return Directive(metadata)(directive);
}

export function MockService(obj: any, config: any = null) {
  const spies = {};
  // spy properties first
  const props = Object.getOwnPropertyNames(obj.prototype).filter(key => {
    return (
      Object.getOwnPropertyDescriptor(obj.prototype, key).get ||
      Object.getOwnPropertyDescriptor(obj.prototype, key).set
    );
  });

  const keys = Object.keys(obj.prototype).filter(
    key => props.indexOf(key) === -1
  );

  for (const prop of props) {
    const property = {
      get: () => false,
      set: () => {},
    };
    if (config && config.props && config.props[prop]) {
      if (config.props[prop].get) {
        property.get = config.props[prop].get;
      }
      if (config.props[prop].set) {
        property.set = config.props[prop].set;
      }
    }
    Object.defineProperty(spies, prop, property);
  }

  for (const key of keys) {
    let value = null;
    if (config && config[key]) {
      value = config[key];
    }
    spies[key] = jasmine.createSpy(key).and.returnValue(value);
  }

  return new Proxy(
    { ...spies, _config: config },
    {
      get: (target, prop) => {
        // if spy exists, return it
        if (target.hasOwnProperty(prop.toString())) {
          return target[prop];
        } else if (prop.toString() === '$quoted$') {
          return [];
        }

        // if a custom return value exists, create a spy and then return it
        if (target['_config'] && target['_config'][prop]) {
          target[prop] = jasmine
            .createSpy(prop.toString())
            .and.returnValue(target['_config'][prop]);

          return target[prop];
        }
        return null;
      },
      set: (target, prop, value, receiver) => {
        target[prop] = jasmine
          .createSpy(prop.toString())
          .and.returnValue(value);
        return true;
      },
    }
  );
}
