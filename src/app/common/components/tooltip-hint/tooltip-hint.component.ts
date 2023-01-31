import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExperimentsService } from '../../../modules/experiments/experiments.service';
import { Storage } from '../../../services/storage';
import { NgStyleValue } from '../../types/angular.types';

// anchor position for tooltip bubble.
type AnchorPosition = 'top' | 'bottom' | 'right' | 'left';

/**
 * Tooltip that shows once in initial load, then not again until moused over.
 * Intended to be used to highlight the release of new features.
 * Will store whether a notice has been seen in local storage.
 */
@Component({
  selector: 'm-tooltipHint',
  templateUrl: './tooltip-hint.component.html',
})
export class TooltipHintComponent implements OnInit {
  // prefix for storage key. identifier for a hint.
  @Input() public storageKeyPrefix: string = 'undefined';

  // name of an icon, if you want to attach to a tooltip icon.
  @Input() public icon: string;

  // anchor position of tooltip.
  @Input() public anchorPosition: AnchorPosition = 'top';

  // whether arrow should be shown on tooltip.
  @Input() public showArrow: boolean = true;

  // adjustment to arrow position.
  @Input() public arrowOffset: number = 0;

  // style for tooltip icon.
  @Input() public iconStyle: NgStyleValue;

  // style for tooltip bubble.
  @Input() public tooltipBubbleStyle: NgStyleValue;

  /**
   * id for an experiment - when experiment is active,
   * hint will work as normal, when off, it will behave
   * a normal tooltip, not prompting users on first viewing.
   */
  @Input() public experimentId: string;

  // whether tooltip should be forced to show.
  public readonly shouldShow$: BehaviorSubject<boolean> = new BehaviorSubject<
    boolean
  >(false);

  // whether tooltip hover behaviour is enabled.
  public readonly tooltipHoverEnabled$: BehaviorSubject<
    boolean
  > = new BehaviorSubject<boolean>(false);

  constructor(
    private storage: Storage,
    private experiments: ExperimentsService
  ) {}

  ngOnInit(): void {
    // if experiment is inactive, fallback to default tooltip behaviour.
    if (this.hasInactiveExperiment()) {
      this.tooltipHoverEnabled$.next(true);
      return;
    }

    const hasShownTooltip = this.storage.get(this.getStorageKey());

    if (!hasShownTooltip) {
      this.showTooltip();
    } else {
      this.tooltipHoverEnabled$.next(true);
    }
  }

  /**
   * Click handler.
   * @returns { void }
   */
  public onClick(): void {
    this.shouldShow$.next(false);
    this.tooltipHoverEnabled$.next(true);
  }

  /**
   * Call to show tooltip manually.
   * @returns { void }
   */
  private showTooltip(): void {
    this.shouldShow$.next(true);
    this.storage.set(this.getStorageKey(), 1);
  }

  /**
   * Gets storage key.
   * @returns { string } storage key.
   */
  private getStorageKey(): string {
    return `${this.storageKeyPrefix}:shown`;
  }

  /**
   * Whether experiment ID is set and given experiment is inactive.
   * @returns { boolean } true if experiment id is set and experiment is inactive.
   */
  private hasInactiveExperiment(): boolean {
    return (
      this.experimentId &&
      !this.experiments.hasVariation(this.experimentId, true)
    );
  }
}
