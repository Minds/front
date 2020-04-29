import {
  Directive,
  EmbeddedViewRef,
  Inject,
  Input,
  PLATFORM_ID,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[mIfBrowser]',
})
export class IfBrowserDirective {
  private _elseTemplateRef: TemplateRef<any>;
  private _viewRef: EmbeddedViewRef<any>;
  private _elseViewRef: EmbeddedViewRef<any>;

  constructor(
    private _templateRef: TemplateRef<any>,
    private _viewContainerRef: ViewContainerRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this._update();
  }

  _update() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this._viewRef) {
        this._viewContainerRef.clear();
        this._elseViewRef = void 0;

        if (this._templateRef) {
          this._viewRef = this._viewContainerRef.createEmbeddedView(
            this._templateRef
          );
        }
      }
    } else {
      if (!this._elseViewRef) {
        this._viewContainerRef.clear();
        this._viewRef = void 0;

        if (this._elseTemplateRef) {
          this._elseViewRef = this._viewContainerRef.createEmbeddedView(
            this._elseTemplateRef
          );
        }
      }
    }
  }
}
