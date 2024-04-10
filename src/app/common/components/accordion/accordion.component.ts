//

import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  OnDestroy,
  QueryList,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AccordionPaneComponent } from './accordion-pane.component';

/**
 * Vertical accordion component. Children should be <m-accordion__pane>
 * Currently used only in channel edit modal
 */
@Component({
  selector: 'm-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ` <ng-content></ng-content> `,
})
export class AccordionComponent implements AfterContentInit, OnDestroy {
  /**
   * [opened] binding
   * @param opened
   * @private
   */
  @Input('opened') set _opened(opened: number) {
    this.opened = opened;

    if (this.initialized) {
      this.sync();
    }
  }

  /**
   * Currently opened pane index
   */
  protected opened: number = 0;

  /**
   * Initialized flag
   */
  protected initialized: boolean = false;

  /**
   * Pane list
   */
  @ContentChildren(AccordionPaneComponent)
  protected panes: QueryList<AccordionPaneComponent>;

  /**
   * Subscription to changes
   */
  protected panesChangeSubscription: Subscription;

  /**
   * Subscriptions to pane toggle events
   */
  protected paneToggleSubscriptions: Array<Subscription> = [];

  /**
   * Sync and subscribe to pane changes
   */
  ngAfterContentInit(): void {
    this.sync();
    this.panesChangeSubscription = this.panes.changes.subscribe(() =>
      this.sync()
    );

    this.initialized = true;
  }

  /**
   * Unsubscribe from everything
   */
  ngOnDestroy(): void {
    if (this.panesChangeSubscription) {
      this.panesChangeSubscription.unsubscribe();
    }

    this.tearDown();
  }

  /**
   * Opens a pane, closing the others
   * @todo add a behavior that keeps other panes open
   * @param pane
   */
  protected openPane(pane: AccordionPaneComponent): void {
    this.panes.toArray().forEach((pane) => pane.setOpened(false));
    pane.setOpened(true);
  }

  /**
   * Sync pane toggle event subscription list
   */
  protected sync(): void {
    this.tearDown();

    this.panes.toArray().forEach((pane, i) => {
      pane.setOpened(this.opened === i);

      this.paneToggleSubscriptions.push(
        pane.toggleEmitter.subscribe(() => {
          this.openPane(pane);
        })
      );
    });
  }

  /**
   * Remove all pane toggle subscriptions
   */
  protected tearDown(): void {
    this.paneToggleSubscriptions.forEach((paneToggleSubscription) =>
      paneToggleSubscription.unsubscribe()
    );
    this.paneToggleSubscriptions = [];
  }
}
