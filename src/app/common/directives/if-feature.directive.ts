// ojm delete file
//import {
//   Directive,
//   EmbeddedViewRef,
//   Input,
//   TemplateRef,
//   ViewContainerRef,
// } from '@angular/core';
// import { FeaturesService } from '../../services/features.service';

// @Directive({
//   selector: '[mIfFeature]',
// })
// export class IfFeatureDirective {
//   private _currentValue: boolean;

//   private _elseTemplateRef: TemplateRef<any>;
//   private _viewRef: EmbeddedViewRef<any>;
//   private _elseViewRef: EmbeddedViewRef<any>;

//   constructor(
//     private _templateRef: TemplateRef<any>,
//     private _viewContainerRef: ViewContainerRef,
//     private _featuresService: FeaturesService
//   ) {}

//   @Input() set mIfFeature(feature: string) {
//     this._currentValue = this._featuresService.has(feature);
//     this._update();
//   }

//   @Input() set mIfFeatureElse(templateRef: TemplateRef<any>) {
//     this._elseTemplateRef = templateRef;
//     this._update();
//   }

//   _update() {
//     if (this._currentValue) {
//       if (!this._viewRef) {
//         this._viewContainerRef.clear();
//         this._elseViewRef = void 0;

//         if (this._templateRef) {
//           this._viewRef = this._viewContainerRef.createEmbeddedView(
//             this._templateRef
//           );
//         }
//       }
//     } else {
//       if (!this._elseViewRef) {
//         this._viewContainerRef.clear();
//         this._viewRef = void 0;

//         if (this._elseTemplateRef) {
//           this._elseViewRef = this._viewContainerRef.createEmbeddedView(
//             this._elseTemplateRef
//           );
//         }
//       }
//     }
//   }
// }
