import { Component, Inject, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ToasterService } from '../../../../../../../../common/services/toaster.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '../../../../../../../../common/common.module';
import { CopyToClipboardService } from '../../../../../../../../common/services/copy-to-clipboard.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { SITE_URL } from '../../../../../../../../common/injection-tokens/url-injection-tokens';
import { isNumericValidator } from '../../../../../../../forms/numeric.validator';

/** Default embed width. */
const DEFAULT_WIDTH: number = 300;

/** Default embed height. */
const DEFAULT_HEIGHT: number = 250;

/**
 * Boost embed builder component. Allows the user to configure and generate
 * embeddable HTML to add a boost slot to their website.
 */
@Component({
  selector: 'm-boostEmbedBuilder',
  styleUrls: ['./boost-embed-builder.component.ng.scss'],
  templateUrl: './boost-embed-builder.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, AsyncPipe, NgIf],
})
export class BoostEmbedBuilderComponent implements OnInit {
  /** Form group. */
  protected formGroup: FormGroup;

  /** Current embed code. */
  protected embedCode$: BehaviorSubject<string> = new BehaviorSubject<string>(
    null
  );

  constructor(
    private formBuilder: FormBuilder,
    private toaster: ToasterService,
    private copyToClipboard: CopyToClipboardService,
    @Inject(SITE_URL) private readonly siteUrl: string
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      iframeWidth: new FormControl<number>(DEFAULT_WIDTH, [
        Validators.min(200),
        Validators.max(1920),
        isNumericValidator(),
      ]),
      iframeHeight: new FormControl<number>(DEFAULT_HEIGHT, [
        Validators.min(200),
        Validators.max(1080),
        isNumericValidator(),
      ]),
    });

    this.generateEmbedCode(false);
  }

  /**
   * Generate embed code.
   * @param { boolean } showToast - Whether or not to show a toast message.
   * @returns { void }
   */
  public generateEmbedCode(showToast: boolean = true): void {
    this.embedCode$.next(this.buildEmbedCode());

    if (showToast) {
      this.toaster.success('Updated embed code dimensions.');
    }
  }

  /**
   * Copy embed code to clipboard.
   * @returns { void }
   */
  public copyEmbedCodeToClipboard(): void {
    this.copyToClipboard.copyToClipboard(this.embedCode$.getValue());
    this.toaster.success('Embed code copied to clipboard.');
  }

  /**
   * Builds embed code from form values.
   * @returns { string } - Embed code.
   */
  private buildEmbedCode(): string {
    const width: number = this.formGroup.get('iframeWidth').value;
    const height: number = this.formGroup.get('iframeHeight').value;

    return `<div class="minds-boost-slot" data-height="${height}px" data-width="${width}px" data-app-url="${this.siteUrl}plugins/embedded-boosts"></div><script async defer crossorigin="anonymous" src="${this.siteUrl}plugins/embedded-boosts/js/embed.min.js"></script>`;
  }
}
