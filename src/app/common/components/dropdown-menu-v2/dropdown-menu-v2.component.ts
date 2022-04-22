import { FastFadeAnimation } from './../../../animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { IconSource } from '../icon/icon.component';
import { animate, style, transition, trigger } from '@angular/animations';

export interface AnchorPosition {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

export interface DropDownMenuItem {
  title: string;
  onPress: () => void;
  icon?: { id: string; from: IconSource };
}

const DropDownFadeAnimation = trigger('dropDownFade', [
  transition(':enter', [
    style({ opacity: 0, height: 0 }),
    animate('100ms ease-out', style({ opacity: 1, height: '*' })),
  ]),
  transition(
    ':leave',
    animate('100ms ease-out', style({ height: 0, opacity: 0 }))
  ),
]);

@Component({
  selector: 'm-dropdownMenuV2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'dropdown-menu-v2.component.html',
  styleUrls: ['dropdown-menu-v2.component.ng.scss'],
  animations: [DropDownFadeAnimation],
})
export class DropdownMenuV2Component implements OnInit, OnDestroy {
  @Input() items: DropDownMenuItem[] = [];

  @Input() triggerClass: string = '';

  @Input() menuClass: string = '';

  @Input() anchorPosition: AnchorPosition = {
    top: '0',
  };

  @ViewChild('triggerElement') triggerElement: ElementRef<HTMLSpanElement>;

  @ViewChild('menuWrapperElement')
  menuWrapperElement: ElementRef<HTMLDivElement>;

  isOpen: boolean = false;

  protected windowSize$: Subject<{
    width: number;
    height: number;
  }> = new Subject<{ width: number; height: number }>();

  protected windowSizeSubscription: Subscription;

  constructor(
    protected cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.windowSizeSubscription = this.windowSize$
      .pipe(debounceTime(250))
      .subscribe(() => this.calculatePosition());
  }

  ngOnDestroy(): void {
    this.windowSizeSubscription.unsubscribe();
  }

  open($event: MouseEvent) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    this.isOpen = true;
    this.detectChanges();

    this.calculatePosition();
  }

  close($event?: MouseEvent) {
    if ($event) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    this.isOpen = false;
  }

  get triggerCssClasses() {
    const classList = [
      'm-dropdownMenu__trigger',
      'm-dropdownMenuTrigger--clickable',
    ];

    if (this.triggerClass) {
      classList.push(
        ...this.triggerClass
          .split(' ')
          .map(className => className.trim())
          .filter(Boolean)
      );
    }

    return classList;
  }

  get menuCssClasses() {
    const classList = ['m-dropdownMenu__menu'];

    if (this.menuClass) {
      classList.push(
        ...this.menuClass
          .split(' ')
          .map(className => className.trim())
          .filter(Boolean)
      );
    }

    return classList;
  }

  @HostListener('window:resize') onWindowResize() {
    this.calculatePosition();
  }

  calculatePosition() {
    // TODO: To be done later (smart anchoring on screen)
    //
    // Only is open, there's a menu wrapper and platform is browser (because of `window`)
    // if (!this.isOpen || !this.menuWrapperElement.nativeElement || !isPlatformBrowser(this.platformId)) {
    //   return;
    // }
    //
    // const win = {
    //   w: window.innerWidth,
    //   h: window.innerHeight,
    // };
    //
    // console.log(this.menuWrapperElement.nativeElement);
    // console.log(JSON.parse(JSON.stringify(this.menuWrapperElement.nativeElement.getBoundingClientRect())));
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }
}
