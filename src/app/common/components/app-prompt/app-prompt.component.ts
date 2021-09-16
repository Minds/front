import { ConfigsService } from './../../services/configs.service';
import { Component, HostListener } from '@angular/core';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  AppPromptService,
  AppPromptState,
} from '../../services/app-prompt.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'm-appPrompt',
  templateUrl: './app-prompt.component.html',
  styleUrls: ['app-prompt.component.ng.scss'],
  animations: [
    trigger('fader', [
      state(
        'active',
        style({
          height: 67,
          transform: 'translateY(0)',
        })
      ),
      state(
        'expanded',
        style({
          height: '85vh',
          transform: 'translateY(0)',
        })
      ),
      state(
        'dismissed',
        style({
          height: 0,
          transform: 'translateY(100px)',
        })
      ),
      transition('dismissed => active', [
        animate(
          '450ms ease',
          keyframes([
            style({
              transform: 'translateY(100px)',
              height: 0,
            }),
            style({ height: 67, transform: 'translateY(0)' }),
          ])
        ),
      ]),
      transition('expanded => active', [
        animate(
          '450ms ease',
          keyframes([
            style({
              height: '85vh',
            }),
            style({ height: 67 }),
          ])
        ),
      ]),
      transition('active => expanded', [
        animate(
          '450ms ease',
          keyframes([
            style({
              height: '*',
            }),
            style({ height: '85vh', visibility: 'visible' }),
          ])
        ),
      ]),
      transition('expanded => dismissed', [
        animate(
          '450ms ease',
          keyframes([
            style({
              height: '85vh',
            }),
            style({
              height: 0,
              transform: 'translateY(100px)',
            }),
          ])
        ),
      ]),
      transition('active => dismissed', [
        animate(
          '450ms ease',
          keyframes([
            style({
              height: 67,
            }),
            style({
              height: 0,
              transform: 'translateY(100px)',
            }),
          ])
        ),
      ]),
    ]),
  ],
})
export class AppPromptComponent {
  readonly cdnAssetsUrl: string;

  constructor(
    private service: AppPromptService,
    protected configs: ConfigsService
  ) {
    this.cdnAssetsUrl = this.configs.get('cdn_assets_url');
  }

  ngOnInit(): void {
    if (this.service.hasAvailableApp()) {
      this.service.setPlatform();

      // open with 2000ms delay
      setTimeout(() => this.service.activate(), 2000);
    }
  }

  /**
   * Get state from service.
   */
  get state$(): BehaviorSubject<AppPromptState> {
    return this.service.state$;
  }

  /**
   * Triggered on navigate click.
   */
  public onClick(e): void {
    e.preventDefault();
    if (this.service.state$.getValue() !== 'active') return;

    this.service.redirect();
  }

  /**
   * Triggered on close click.
   */
  public onClose(e): void {
    e.stopPropagation();
    this.service.close();
  }
}
