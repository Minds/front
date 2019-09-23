import {
  Component,
  ViewChild,
  Input,
  ComponentFactoryResolver,
  AfterViewInit,
  Type,
  ChangeDetectorRef,
  ComponentRef,
  ElementRef,
  Injector,
  SkipSelf,
} from '@angular/core';

import { DynamicHostDirective } from '../../directives/dynamic-host.directive';

import { UserCard } from '../../../modules/legacy/components/cards/user/user';
import { Activity } from '../../../modules/legacy/components/cards/activity/activity';
import { GroupsCard } from '../../../modules/groups/card/card';
import { ImageCard } from '../../../modules/legacy/components/cards/object/image/image';
import { VideoCard } from '../../../modules/legacy/components/cards/object/video/video';
import { AlbumCard } from '../../../modules/legacy/components/cards/object/album/album';
import { BlogCard } from '../../../modules/blogs/card/card';
import { CommentComponentV2 } from '../../../modules/comments/comment/comment.component';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'minds-card',
  template: `
    <ng-template dynamic-host></ng-template>
    <div
      class="m-mindsCard__overlay"
      (click)="goToEntityPage()"
      *ngIf="openInNewTab"
    ></div>
  `,
  providers: [ActivityService],
})
export class MindsCard implements AfterViewInit {
  @Input() openInNewTab: boolean = false;
  @ViewChild(DynamicHostDirective, { static: true })
  cardHost: DynamicHostDirective;

  object: any = {};
  type: string;

  componentRef: ComponentRef<{}>;
  componentInstance: any;
  anchorRef: ElementRef;

  cssClasses: string = '';
  flags: any = {};

  private initialized: boolean = false;

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _injector: Injector
  ) {}

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

    switch (this.getType(this.object)) {
      case 'user':
        return UserCard;
      case 'activity':
        return Activity;
      case 'comment':
        return CommentComponentV2;
      case 'group':
        return GroupsCard;
      case 'object:image':
        return ImageCard;
      case 'object:video':
        return VideoCard;
      case 'object:blog':
        return BlogCard;
      case 'object:album':
        return AlbumCard;
    }

    return null;
  }

  goToEntityPage() {
    let url: string;
    switch (this.getType(this.object)) {
      case 'user':
        url = `/${this.object.username}`;
        break;
      case 'activity':
        url = `/newsfeed/${this.object.guid}`;
        break;
      case 'object:image':
      case 'object:video':
      case 'object:album':
        url = `/media/${this.object.guid}`;
        break;
      case 'object:blog':
        url = this.object.route;
        break;
    }

    if (url) {
      window.open(url, '_blank');
    }
  }

  loadComponent() {
    const componentClass = this.resolveComponentClass(this.object);

    if (!componentClass) {
      return;
    }

    const componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        componentClass
      ),
      viewContainerRef = this.cardHost.viewContainerRef;

    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(
      componentFactory,
      undefined,
      this._injector
    );
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
    } else if (this.object.type === 'comment') {
      const commentComp: CommentComponentV2 = <CommentComponentV2>(
        this.componentInstance
      );
      commentComp.comment = this.object;
      commentComp.canEdit = false;
      commentComp.hideToolbar = this.flags.hideTabs || true;
    } else {
      this.componentInstance.object = this.object;

      if (this.object.type === 'activity') {
        (<Activity>this.componentInstance).hideTabs =
          this.flags.hideTabs || false;
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

  private getType(entity: any): string {
    return entity.type === 'object'
      ? `${entity.type}:${entity.subtype}`
      : entity.type;
  }
}
