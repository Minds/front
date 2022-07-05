import { ConfigsService } from '../../common/services/configs.service';
import { Component } from '@angular/core';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AppPromptService, AppPromptState } from './app-prompt.service';
import { BehaviorSubject } from 'rxjs';

/**
 * Bottom banner, prompts users on mobile/tablet to download the app
 */
@Component({
  selector: 'm-appPrompt',
  templateUrl: './app-prompt.component.html',
  styleUrls: ['app-prompt.component.ng.scss'],
  animations: [
    trigger('fader', [
      state(
        'active',
        style({
          transform: 'translateY(calc(80vh - 80px))',
        })
      ),
      state(
        'expanded',
        style({
          transform: 'translateY(0)',
        })
      ),
      state(
        'dismissed',
        style({
          transform: 'translateY(100vh)',
        })
      ),
      transition('dismissed => active', [
        animate(
          '450ms ease',
          keyframes([
            style({
              transform: 'translateY(100vh)',
            }),
            style({ transform: 'translateY(calc(80vh - 80px))' }),
          ])
        ),
      ]),
      transition('expanded => active', [
        animate(
          '450ms ease',
          keyframes([
            style({
              transform: 'translateY(0)',
            }),
            style({ transform: 'translateY(calc(80vh - 80px))' }),
          ])
        ),
      ]),
      transition('active => expanded', [
        animate(
          '450ms ease',
          keyframes([
            style({
              transform: 'translateY(calc(80vh - 80px))',
            }),
            style({ transform: 'translateY(0)' }),
          ])
        ),
      ]),
      transition('expanded => dismissed', [
        animate(
          '450ms ease',
          keyframes([
            style({
              transform: 'translateY(0)',
            }),
            style({ transform: 'translateY(100vh)' }),
          ])
        ),
      ]),
      transition('active => dismissed', [
        animate(
          '450ms ease',
          keyframes([
            style({
              transform: 'translateY(calc(80vh - 80px))',
            }),
            style({
              transform: 'translateY(100vh)',
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
    if (this.service.shouldShowPrompt()) {
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
