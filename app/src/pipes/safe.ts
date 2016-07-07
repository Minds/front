import { Pipe, Renderer }  from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser'

@Pipe({
  name: 'safe'
})

export class SafePipe {

  constructor(private sanitizer : DomSanitizationService) {
  }

  transform(value: string, args: any[]) {

    if(!value)
      return value;

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
