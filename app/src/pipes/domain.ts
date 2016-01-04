import { Pipe, Inject, Renderer }  from 'angular2/core';

@Pipe({
  name: 'domain'
})

export class DomainPipe {

  constructor() {
  }


  transform(value: string, args: any[]) {

    if(!value)
      return value;

    var matches,
      output = value,
			urls = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im;

		matches = urls.exec( value );

		if (matches !== null)
			output = matches[1];

		if (output.indexOf('www.') > -1)
			output = output.split('www.').pop();

    return output;

  }


}
