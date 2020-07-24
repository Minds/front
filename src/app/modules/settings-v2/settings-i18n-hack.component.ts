import { Component } from '@angular/core';

/**
 * This file is a workaround because xi18n does not extract keys from .ts files
 */
@Component({
  selector: 'm-settingsV2__i18nHack',
  template: `
    <!-- MENU HEADERS ARE HERE IF THEY DONT HAVE COMPONENTS -->
    <!-- TOP LEVEL -->
    <ng-container i18n="@@SETTINGS__HEADER__LABEL">Settings</ng-container>
    <ng-container i18n="@@SETTINGS__ACCOUNT__LABEL">Account</ng-container>
    <ng-container i18n="@@SETTINGS__PRO__LABEL">Pro</ng-container>
    <ng-container i18n="@@SETTINGS__SECURITY__LABEL">Security</ng-container>
    <ng-container i18n="@@SETTINGS__BILLING__LABEL">Billing</ng-container>
    <ng-container i18n="@@SETTINGS__OTHER__LABEL">Other</ng-container>
    <ng-container i18n="@@SETTINGS__ACCOUNT__HEADER__LABEL"
      >General Account Settings</ng-container
    >
    <ng-container i18n="@@SETTINGS__SECURITY__HEADER__LABEL"
      >Security</ng-container
    >

    <!-- SUB LEVEL -->
    <ng-container i18n="@@SETTINGS__NOTIFICATIONS__HEADER__LABEL"
      >Notifications</ng-container
    >
    <ng-container i18n="@@SETTINGS__ACCOUNTUPGRADE__HEADER__LABEL"
      >Account Upgrade</ng-container
    >
    <ng-container i18n="@@SETTINGS__BILLING__HEADER__LABEL"
      >Billing</ng-container
    >
    <ng-container i18n="@@SETTINGS__OTHER__CONTENTADMIN__HEADER__LABEL"
      >Content Admin</ng-container
    >
    <ng-container i18n="@@SETTINGS__OTHER__PAIDCONTENT__HEADER__LABEL"
      >Paid Content</ng-container
    >
    <ng-container i18n="@@SETTINGS__OTHER__LEAVE__HEADER__LABEL"
      >Deactivate and Delete Account</ng-container
    >

    <ng-container i18n="@@SETTINGS__PRO__HEADER__LABEL">
      Pro Settings
    </ng-container>
    <ng-container i18n="@@SETTINGS__PRO__SUBSCRIPTION__HEADER__LABEL">
      Pro Subscription Management
    </ng-container>

    <ng-container i18n="@@SETTINGS__ACCOUNT__MESSENGER__LABEL:Messenger"
      >Messenger</ng-container
    >
    <!-- LINKS (NO COMPONENTS) -->
    <ng-container i18n="@@SETTINGS__ACCOUNTUPGRADE__PRO__LABEL"
      >Upgrade to Pro</ng-container
    >
    <ng-container i18n="@@SETTINGS__ACCOUNTUPGRADE__PLUS__LABEL"
      >Upgrade to Plus</ng-container
    >
    <ng-container i18n="@@SETTINGS__PRO__VIEW__CHANNEL__LABEL">
      View Pro Channel
    </ng-container>

    <!-- SEE COMPONENTS FOR OTHER HEADERS -->
  `,
})
export class SettingsV2I18nHack {}
