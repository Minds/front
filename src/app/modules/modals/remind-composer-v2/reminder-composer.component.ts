import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  HostBinding,
  Input,
  ViewChild,
} from '@angular/core';
import { DynamicHostDirective } from '../../../common/directives/dynamic-host.directive';
import { AutocompleteSuggestionsService } from '../../suggestions/services/autocomplete-suggestions.service';
import { ActivityPreview } from '../../legacy/components/cards/activity/preview';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api/client';

@Component({
  selector: 'm-modal__remindComposer',
  templateUrl: 'remind-composer.component.html',
})
export class RemindComposerModalComponent implements AfterViewInit {
  post: EventEmitter<any> = new EventEmitter();
  object: any = {};

  message: string = '';

  inProgress: boolean = false;

  @ViewChild(DynamicHostDirective, { static: true })
  cardHost: DynamicHostDirective;

  @Input('object') set data(object) {
    this.object = object;
  }

  @HostBinding('class') get class() {
    return 'mdl-card';
  }

  set _default(message: string) {
    this.message = message;
  }

  constructor(
    public client: Client,
    public suggestions: AutocompleteSuggestionsService,
    public overlayModal: OverlayModalService,
    private _componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngAfterViewInit() {
    this.loadPreview();
  }

  async close() {
    this.object.reminded = true;
    this.object.reminds++;

    this.inProgress = true;

    try {
      const response: any = await this.client.post(
        'api/v2/newsfeed/remind/' + this.object.guid,
        {
          message: this.message,
        }
      );

      this.post.next({
        message: this.message,
      });
    } catch (e) {
      this.object.reminded = false;
      this.object.reminds--;
    }
    this.inProgress = false;
    this.overlayModal.dismiss();
  }

  send() {
    this.close();
  }

  loadPreview() {
    const previewFactory = this._componentFactoryResolver.resolveComponentFactory(
        ActivityPreview
      ),
      viewContainerRef = this.cardHost.viewContainerRef;

    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(previewFactory);

    if (this.object && !this.object.remind_object) {
      (<ActivityPreview>componentRef.instance).object = this.object;
    } else if (this.object && this.object.remind_object) {
      (<ActivityPreview>(
        componentRef.instance
      )).object = this.object.remind_object;
    }

    componentRef.changeDetectorRef.detectChanges();
  }
}
