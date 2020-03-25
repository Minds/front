import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';
import { Client } from '../../../services/api/client';
import { Session } from '../../../services/session';
import { ChannelOnboardingService } from './onboarding.service';
import { Modal } from '../../../common/components/modal/modal.component';
import { ConfigsService } from '../../../common/services/configs.service';

@Component({
  selector: 'm-channel--onboarding',
  template: `
    <m-modal
      [open]="true"
      [allowClose]="service.slide.canSkip"
      (closed)="onClose()"
      class="m-channel--onboarding"
    >
      <div class="m-channelOnboarding__logo">
        <img [src]="cdnAssetsUrl + 'assets/logos/bulb.svg'" />
      </div>
      <ng-template dynamic-host></ng-template>

      <div class="m-channelOnboarding__buttons">
        <div
          class="m-channelOnboarding__previous"
          (click)="service.previous()"
          [ngStyle]="{
            visibility: service.currentSlide === 0 ? 'hidden' : 'visible'
          }"
        >
          Previous
        </div>
        <div
          class="m-channelOnboarding__next"
          *ngIf="service.currentSlide + 1 < service.slides.length"
          (click)="service.next()"
        >
          Next
        </div>
        <div
          class="m-channelOnboarding__next"
          *ngIf="service.currentSlide + 1 === service.slides.length"
          (click)="service.next()"
        >
          Finish
        </div>
      </div>
    </m-modal>
  `,
})
export class ChannelOnboardingComponent {
  readonly cdnAssetsUrl: string;

  @ViewChild(DynamicHostDirective, { static: true }) host;

  inProgress: boolean = false;
  closeSubscription;
  error: string;

  constructor(
    protected client: Client,
    protected cd: ChangeDetectorRef,
    protected session: Session,
    protected router: Router,
    public service: ChannelOnboardingService,
    private _componentFactoryResolver: ComponentFactoryResolver,
    configs: ConfigsService
  ) {
    this.cdnAssetsUrl = configs.get('cdn_assets_url');
  }

  ngOnInit() {
    this.closeSubscription = this.service.onClose.subscribe(() => {
      this.onClose();
    });

    this.service.onSlideChanged.subscribe(() => {
      this.loadSlide();
    });

    this.loadSlide();
  }

  ngOnDestroy() {
    this.closeSubscription.unsubscribe();
  }

  loadSlide() {
    const viewContainerRef = this.host.viewContainerRef;
    viewContainerRef.clear();

    if (!this.service.slide) {
      return;
    }

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
      this.service.slide
    );

    let componentRef = viewContainerRef.createComponent(componentFactory);

    componentRef.instance.pendingItems = this.service.pendingItems || [
      this.service.slide.items,
    ];

    if (componentRef.instance.onClose) {
      componentRef.instance.onClose.subscribe(next => {
        this.service.next();
        this.loadSlide();
        this.detectChanges();
      });
    }

    componentRef.changeDetectorRef.markForCheck();
    componentRef.changeDetectorRef.detectChanges();
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  async onClose() {
    try {
      const response: any = await this.client.post(
        'api/v2/onboarding/onboarding_shown'
      );
      this.service.onClose.emit();
    } catch (e) {
      console.error(e);
    }
  }
}
