import { BehaviorSubject } from 'rxjs';
import { TopbarComponent } from './topbar/topbar.component';
import { Injectable } from '@angular/core';

type TopbarComponentT = TopbarComponent;

@Injectable()
export class TopbarService {
  private container: TopbarComponentT;

  /** Whether topbar is in FORCED minimal light mode. */
  public readonly isMinimalLightMode$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  /** Whether topbar is to be displayed in minimal mode (dynamic based on light or dark theme). */
  public readonly isMinimalMode$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  setContainer(container: TopbarComponentT) {
    this.container = container;
    return this;
  }

  toggleMarketingPages(
    value: boolean,
    showBottombar: boolean = true,
    forceBackground: boolean = true
  ): void {}

  toggleVisibility(visible: boolean): void {
    if (this.container) {
      this.container.toggleVisibility(visible);
    }
  }

  toggleSearchBar(visible: boolean): void {
    if (this.container) {
      (<TopbarComponent>this.container).toggleSearchBar(visible);
    }
  }
}
