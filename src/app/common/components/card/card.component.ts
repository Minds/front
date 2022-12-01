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
  OnInit,
} from '@angular/core';

import { DynamicHostDirective } from '../../directives/dynamic-host.directive';

import { GroupsCard } from '../../../modules/groups/card/card';
import { BlogCard } from '../../../modules/blogs/card/card';
import { CommentComponentV2 } from '../../../modules/comments/comment/comment.component';
import { ActivityService } from '../../services/activity.service';
import { ActivityComponent } from '../../../modules/newsfeed/activity/activity.component';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';
import { UserCard } from '../user-card/user';

/**
 * Generic component that receives an entity, figures out the entity type,
 * then presents the entity with its corresponding presentation component
 *
 * e.g. if it determines the entity is a blog, it creates and presents the BlogCardComponent
 *
 * See it in the boost console "Create a Boost" section
 */
@Component({
  selector: 'minds-card',
  template: `
    <ng-template dynamic-host></ng-template>
  `,
  styleUrls: ['./card.component.ng.scss'],
  providers: [ActivityService],
})
export class MindsCard implements AfterViewInit {
  @Input() forceShowSubscribe = false;

  /**
   * Display options for activity v2 entities
   */
  @Input() displayOptions: any;

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

    if (object.type === 'user') {
      return UserCard;
    } else if (
      object.type === 'activity' ||
      object.subtype === 'image' ||
      object.subtype === 'video' ||
      object.subtype === 'album'
    ) {
      return ActivityComponent;
    } else if (object.type === 'group') {
      return GroupsCard;
    } else if (object.subtype === 'blog') {
      return BlogCard;
    } else if (object.type === 'comment') {
      return CommentComponentV2;
    }

    return null;
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
    } else if (this.object.type === 'user') {
      this.componentInstance.object = this.object;
      this.componentInstance.forceShowSubscribe = this.forceShowSubscribe;
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
      this.componentInstance.entity = this.object;

      if (this.displayOptions) {
        (<ActivityComponent>(
          this.componentInstance
        )).displayOptions = this.displayOptions;
      }
    }

    this.componentRef.changeDetectorRef.detectChanges();
  }

  updateClasses() {
    if (
      !this.anchorRef ||
      !this.anchorRef.nativeElement ||
      !this.anchorRef.nativeElement.nextSibling
    ) {
      return;
    }

    // @note: find a better way (when Angular implements one)
    this.anchorRef.nativeElement.nextSibling.className = this.cssClasses;
  }
}
