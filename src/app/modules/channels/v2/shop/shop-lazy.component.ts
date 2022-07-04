import {
  Component,
  Input,
  Compiler,
  Injector,
  ViewChild,
  ViewContainerRef,
  ChangeDetectorRef,
} from '@angular/core';

/**
 * Lazy loaded container for 'm-channelShop__brief'
 */
@Component({
  selector: 'm-channelShop__lazy',
  template: `
    <ng-template #anchor></ng-template>
  `,
})
export class ChannelShopLazyComponent {
  @Input() component: string;
  @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;

  constructor(
    private compiler: Compiler,
    private injector: Injector,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadComponent();
  }

  async loadComponent() {
    // Import our module
    const { ChannelsShopModule } = await import('./shop.module');

    const moduleFactory = await this.compiler.compileModuleAsync(
      ChannelsShopModule
    );
    const moduleRef = moduleFactory.create(this.injector);

    // Resolves the available components
    const componentFactories = moduleRef.instance.resolveComponents();
    const componentFactory = componentFactories[this.component];

    // Attach the component
    this.anchor.clear();
    this.anchor.createComponent(componentFactory);

    // Trigger change detection
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
