import {
  Component,
  ViewChild,
  Input,
  ComponentFactoryResolver,
  AfterViewInit,
  Type,
  ChangeDetectorRef,
  ComponentRef,
  ElementRef
} from '@angular/core';

import { DynamicHostDirective } from '../../directives/dynamic-host.directive';

import { UserCard } from '../../../modules/legacy/components/cards/user/user';
import { Activity } from '../../../modules/legacy/components/cards/activity/activity';
import { GroupsCard } from '../../../plugins/Groups/card/card';
import { ImageCard } from '../../../modules/legacy/components/cards/object/image/image';
import { VideoCard } from '../../../modules/legacy/components/cards/object/video/video';
import { BlogCard } from '../../../plugins/blog/card/card';
import { AlbumCard } from '../../../modules/legacy/components/cards/object/album/album';

@Component({
  selector: 'minds-card',
  template: `
    <ng-template dynamic-host></ng-template>
  `
})
export class MindsCard implements AfterViewInit {
  @ViewChild(DynamicHostDirective) cardHost: DynamicHostDirective;

  object: any = {};
  type: string;

  componentRef: ComponentRef<{}>;
  componentInstance: any;
  anchorRef: ElementRef;

  cssClasses: string = '';
  flags: any = {};

  private initialized: boolean = false;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver
  ) { }

  @Input('object') set _object(value: any) {
    const oldType = this.type;

    this.object = value ? value : {};
    this.type = `${this.object.type || ''}/${this.object.subtype || ''}`;

    if (this.initialized) {
      if (!this.componentInstance || this.type !== oldType) {
        setTimeout(() => this.loadComponent(), 0);
      } else {
        this.updateData();
      }
    }
  }

  @Input('hostClass') set _hostClass(value: string) {
    this.cssClasses = value || '';

    if (this.initialized) {
      this.updateClasses();
    }
  }

  @Input('flags') set _flags(value: any) {
    this.flags = value || {};

    if (this.initialized) {
      this.updateData();
    }
  }

  ngAfterViewInit() {
    this.loadComponent();
    this.initialized = true;
  }

  resolveComponentClass(object: any): Type<{}> | null {
    if (!object) {
      return null;
    }

    if (object.type === 'user') {
      return UserCard;
    } else if (object.type === 'activity') {
      return Activity;
    } else if (object.type === 'group') {
      return GroupsCard;
    } else if (object.subtype === 'image') {
      return ImageCard;
    } else if (object.subtype === 'video') {
      return VideoCard;
    } else if (object.subtype === 'blog') {
      return BlogCard;
    } else if (object.subtype === 'album') {
      return AlbumCard;
    }

    return null;
  }

  loadComponent() {
    const componentClass = this.resolveComponentClass(this.object);

    if (!componentClass) {
      return;
    }

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(componentClass),
      viewContainerRef = this.cardHost.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    this.componentInstance = this.componentRef.instance;
    this.anchorRef = viewContainerRef.element;

    this.updateData();
    this.updateClasses();
  }

  updateData() {
    if (!this.componentInstance) {
      return;
    }

    if (this.object.type === 'group') {
      (<GroupsCard>this.componentInstance).group = this.object;
    } else if (this.object.subtype === 'blog') {
      (<BlogCard>this.componentInstance)._blog = this.object;
    } else {
      this.componentInstance.object = this.object;

      if (this.object.type === 'activity') {
        (<Activity>this.componentInstance).hideTabs = this.flags.hideTabs || false;
      }
    }

    this.componentRef.changeDetectorRef.detectChanges();
  }

  updateClasses() {
    if (!this.anchorRef || !this.anchorRef.nativeElement) {
      return;
    }

    // @note: find a better way (when Angular implements one)
    this.anchorRef.nativeElement.nextSibling.className = this.cssClasses;
  }
}
