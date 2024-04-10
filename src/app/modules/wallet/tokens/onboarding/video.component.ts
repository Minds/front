import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ViewChild,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../../services/api/client';
import { Session } from '../../../../services/session';
import { TokenOnboardingService } from './onboarding.service';
import { DynamicHostDirective } from '../../../../common/directives/dynamic-host.directive';
import { Storage } from '../../../../services/storage';

/**
 * DEPRECATED
 */
@Component({
  selector: 'm-token--onboarding--video',
  template: `
    <video controls #video>
      <source [src]="src" type="video/mp4" />
    </video>
    <i class="material-icons" (click)="play()" *ngIf="video.paused"
      >play_arrow</i
    >
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TokenOnboardingVideoComponent {
  @ViewChild('video', { static: true }) videoEl;
  @Input() src: string;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    console.log(this.videoEl);
    this.videoEl.nativeElement.addEventListener('play', () => {
      this.detectChanges();
    });

    this.videoEl.nativeElement.addEventListener('pause', () => {
      this.detectChanges();
    });
  }

  play() {
    this.videoEl.nativeElement.play();
    this.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
