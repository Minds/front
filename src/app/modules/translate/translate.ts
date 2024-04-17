import { Component, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { TranslationService } from '../../services/translation';
import { ToasterService } from '../../common/services/toaster.service';

/**
 * Displays translated text
 *
 * Users can select from a menu of languages
 *
 * See it by clicking 'translate' in an activity's dropdown menu
 */
@Component({
  moduleId: module.id,
  selector: 'm-translate',
  inputs: ['_open: open', '_entity: entity', '_translateEvent: translateEvent'],
  outputs: ['onTranslateInit', 'onTranslate', 'onTranslateError'],
  exportAs: 'translate',
  templateUrl: 'translate.html',
})
export class Translate {
  onTranslateInit: EventEmitter<any> = new EventEmitter();
  onTranslate: EventEmitter<any> = new EventEmitter();
  onTranslateError: EventEmitter<any> = new EventEmitter();

  languagesInProgress: boolean = false;
  languagesError: boolean = false;

  preferredLanguages: any[] = [];
  languages: any[] = [];

  open: boolean = false;
  entity: any = {};
  translateEvent: EventEmitter<any> = new EventEmitter();
  translateEventSubscription: any;

  translatable: boolean = false;
  translation = {
    translated: false,
    target: '',
    error: false,
    message: '',
    title: '',
    description: '',
    body: '',
    source: '',
  };
  translationInProgress: boolean;
  hasNav2020: boolean = true;

  constructor(
    public translationService: TranslationService,
    public changeDetectorRef: ChangeDetectorRef,
    private toasterService: ToasterService
  ) {}

  set _open(value: any) {
    let wasOpened = !this.open && value;
    this.open = value;

    if (wasOpened && !this.translation.translated) {
      this.onOpen();
    } else if (wasOpened) {
      this.changeDefaultLanguage();
    }
  }

  set _entity(value: any) {
    this.entity = value;
    this.translatable = this.translationService.isTranslatable(this.entity);
  }

  set _translateEvent(value: any) {
    if (this.translateEventSubscription) {
      this.translateEventSubscription.unsubscribe();
    }

    this.translateEvent = value;

    if (!value) {
      return;
    }

    this.translateEventSubscription = this.translateEvent.subscribe(
      ($event) => {
        this.translate($event);
      }
    );
  }

  ngOnInit() {
    this.languagesInProgress = true;

    this.translationService
      .getLanguages()
      .then((languages: any[]) => {
        this.languagesInProgress = false;
        this.parseLanguages(languages);

        this.changeDetectorRef.markForCheck();
      })
      .catch((e) => {
        this.languagesInProgress = false;
        this.languagesError = true;

        this.changeDetectorRef.markForCheck();

        console.error('TranslateModal::onInit', e);
      });
  }

  ngOnDestroy() {
    if (this.translateEventSubscription) {
      this.translateEventSubscription.unsubscribe();
    }
  }

  onOpen() {
    this.translationService.getUserDefaultLanguage().then((lang) => {
      if (lang) {
        this.select(lang);
      }
    });
  }

  changeDefaultLanguage() {
    this.translationService.purgeLanguagesCache();
    this.open = true;
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

    let $event = {
      entity: this.entity,
      selected: language,
    };

    this.onTranslateInit.emit($event);
    this.changeDetectorRef.markForCheck();

    this.translate($event);
  }

  translate($event: any = {}) {
    if (!$event.selected) {
      return;
    }

    this.open = false;

    if (!this.translationService.isTranslatable(this.entity)) {
      return;
    }

    this.translation.target = '';
    this.translationService.getLanguageName($event.selected).then((name) => {
      this.translation.target = name;
      this.changeDetectorRef.markForCheck();
    });

    this.translationInProgress = true;

    this.translationService
      .translate(this.entity.guid, $event.selected)
      .then((translation: any) => {
        this.translationInProgress = false;
        this.translation.source = null;

        for (let field in translation) {
          this.translation.translated = true;
          this.translation[field] = translation[field].content;

          if (this.translation.source === null && translation[field].source) {
            this.translation.source = '';
            this.translationService
              .getLanguageName(translation[field].source)
              .then((name) => {
                this.translation.source = name;
                this.changeDetectorRef.markForCheck();
              });
          }
        }

        this.onTranslate.emit({
          entity: this.entity,
          translation: this.translation,
          selected: $event.selected,
        });

        this.changeDetectorRef.markForCheck();
      })
      .catch((e) => {
        this.translationInProgress = false;
        this.translation.error = true;
        this.toasterService.error(
          'Sorry, there was an error when translating this content.'
        );

        this.onTranslateError.emit({
          entity: this.entity,
          selected: $event.selected,
        });

        this.changeDetectorRef.markForCheck();

        console.error('translate()', e);
      });
  }

  hideTranslation() {
    if (!this.translation.translated) {
      return;
    }

    this.open = false;
    this.translation.translated = false;
    this.changeDetectorRef.markForCheck();
  }
}
