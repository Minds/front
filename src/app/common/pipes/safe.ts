import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: false,
})
export class SafePipe {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string) {
    if (!value) return value;

    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Pipe({
  name: 'safeUrl',
  standalone: false,
})
export class SafeUrlPipe {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string) {
    if (!value) return value;

    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}

@Pipe({
  name: 'safeStyle',
  standalone: false,
})
export class SafeStylePipe {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string) {
    if (!value) return value;

    return this.sanitizer.bypassSecurityTrustStyle(value);
  }
}
