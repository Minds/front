import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ThemeService } from '../../../../../common/services/theme.service';

@Component({
  selector: 'm-wallet__bridge',
  templateUrl: './bridge.component.html',
  styleUrl: './bridge.component.ng.scss',
})
export class WalletBridgeComponent implements OnInit {
  public src: SafeUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.isDark$.subscribe(() => this.buildSrc());
  }

  private buildSrc(): void {
    const isDark = this.themeService.isDark$.value;
    const primary = isDark ? 'rgb(255, 208, 72)' : 'rgb(27, 133, 214)';
    const primaryForeground = isDark ? 'rgb(0,0,0)' : 'rgb(255,255,255)';
    const background = isDark ? 'rgb(0,0,0)' : 'rgb(255,255,255)';
    const secondary = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.02)';
    const foreground = isDark ? 'rgb(255,255,255)' : 'rgb(0,0,0)';

    const theme = JSON.stringify({
      'primary-dark': primary,
      'primary': primary,
      'primary-foreground-dark': primaryForeground,
      'primary-foreground': primaryForeground,
      'background': background,
      'background-dark': background,
      'card-dark': background,
      'card': background,
      'secondary-dark': secondary,
      'secondary': secondary,
      'muted-dark': secondary,
      'muted': secondary,
      'card-foreground': foreground,
      'card-foreground-dark': foreground,
      'secondary-foreground': foreground,
      'secondary-foreground-dark': foreground,
      'foreground': foreground,
      'foreground-dark': foreground,
    });
    this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
      'https://superbridge.app/?widget=true&tokenAddress=0xb26631c6dda06ad89b93c71400d25692de89c068&fromChainId=1&toChainId=8453&theme=' +
        theme
    );
  }
}
