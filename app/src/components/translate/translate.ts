import { Component, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';

import { TranslationService } from '../../services/translation';

@Component({
  selector: 'm-translate',
  outputs: [ 'action' ],
  directives: [ CORE_DIRECTIVES ],
  template: `
    <i class="material-icons m-material-icons-inline">public</i>
    Translate to:
    <div class="m-translate-select">
      <select class="m-translate-select-control"
        (change)="select($event.target.value)"
        [disabled]="languagesInProgress"
      >
        <option value="" selected>Language&hellip;</option>

        <optgroup label="Preferred Languages" *ngIf="preferredLanguages.length > 0">
          <option *ngFor="let language of preferredLanguages"
            [value]="language.language"
          >
            {{ language.name }} ({{ language.language }})
          </option>
        </optgroup>

        <optgroup label="{{ preferredLanguages.length > 0 ? 'Other' : 'All Languages' }}">
          <option *ngFor="let language of languages"
            [value]="language.language"
          >
            {{ language.name }} ({{ language.language }})
          </option>
        </optgroup>
      </select>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class Translate {
  action: EventEmitter<any> = new EventEmitter();

  languagesInProgress: boolean = false;
  languagesError: boolean = false;

  preferredLanguages: any[] = [];
  languages: any[] = [];

  constructor(
    public translation: TranslationService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.languagesInProgress = true;
    this.changeDetectorRef.markForCheck();

    this.translation.getLanguages()
      .then((languages: any[]) => {
        this.languagesInProgress = false;
        this.parseLanguages(languages);

        this.changeDetectorRef.markForCheck();
      })
      .catch(e => {
        this.languagesInProgress = false;
        this.languagesError = true;

        this.changeDetectorRef.markForCheck();
        console.error('TranslateModal::onInit', e);
      })
  }

  parseLanguages(allLanguages: any[]) {
    this.preferredLanguages = [];
    this.languages = [];

    allLanguages.forEach((language: any) => {
      if (language.isPreferred) {
        this.preferredLanguages.push(language);
      } else {
        this.languages.push(language);
      }
    });
  }

  select(language: string) {
    if (!language) {
      return;
    }

    this.action.emit({
      selected: language
    });
  }
}
