import { Component } from '@angular/core';

/**
 * This is a hack to manually add translations to i18n. Useful for dynamic translations
 */
@Component({
  selector: 'm-i18nExtension',
  template: `
    <ng-container i18n="@@REPORT__1">Illegal</ng-container>
    <ng-container i18n="@@REPORT__1.1">Terrorism</ng-container>
    <ng-container i18n="@@REPORT__1.2">Sexualization of minors</ng-container>
    <ng-container i18n="@@REPORT__1.3">Extortion</ng-container>
    <ng-container i18n="@@REPORT__1.4">Fraud</ng-container>
    <ng-container i18n="@@REPORT__1.5">Revenge Porn</ng-container>
    <ng-container i18n="@@REPORT__1.6">Trafficking</ng-container>

    <ng-container i18n="@@REPORT__2">NSFW (not safe for work)</ng-container>
    <ng-container i18n="@@REPORT__2.1">Nudity</ng-container>
    <ng-container i18n="@@REPORT__2.2">Pornography</ng-container>
    <ng-container i18n="@@REPORT__2.3">Profanity</ng-container>
    <ng-container i18n="@@REPORT__2.4">Violance and Gore</ng-container>
    <ng-container i18n="@@REPORT__2.5">Race, Religion, Gender</ng-container>

    <ng-container i18n="@@REPORT__3">Incitement to violence</ng-container>
    <ng-container i18n="@@REPORT__4">Harassment</ng-container>
    <ng-container i18n="@@REPORT__5"
      >Personal and confidential information</ng-container
    >
    <ng-container i18n="@@REPORT__7">Impersonation</ng-container>
    <ng-container i18n="@@REPORT__8">Spam</ng-container>
    <ng-container i18n="@@REPORT__10"
      >Intellectual Property violation</ng-container
    >
    <ng-container i18n="@@REPORT__11">Another reason</ng-container>
    <ng-container i18n="@@REPORT__13">Malware</ng-container>
    <ng-container i18n="@@REPORT__16">Inauthentic engagement</ng-container>
    <ng-container i18n="@@REPORT__17">Security</ng-container>
    <ng-container i18n="@@REPORT__17.1">Hacked account</ng-container>
  `,
})
export class I18nExtensionComponent {}
