import { Component, OnInit, Input, Output, EventEmitter, NgZone, ViewChild, ElementRef, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ReCaptchaService } from './recaptcha.service';

@Component({
    selector: 're-captcha',
    template: '<div #target></div>',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ReCaptchaComponent),
            multi: true
        }
    ]
})
export class ReCaptchaComponent implements OnInit, ControlValueAccessor {

    @Input() site_key: string = null;
    @Input() theme = 'light';
    @Input() type = 'image';
    @Input() size = 'normal';
    @Input() tabindex = 0;
    @Input() badge = 'bottomright';
    /* Available languages: https://developers.google.com/recaptcha/docs/language */
    @Input() language: string = null;

    @Output() captchaResponse = new EventEmitter<string>();
    @Output() captchaExpired = new EventEmitter();

    @ViewChild('target') targetRef: ElementRef;
    widgetId: any = null;

    onChange: Function = () => {
        return;
    }
    onTouched: Function = () => {
        return;
    }

    constructor(
        private _zone: NgZone,
        private _captchaService: ReCaptchaService
    ) {
    }

    ngOnInit() {
        this._captchaService.getReady(this.language)
            .subscribe((ready) => {
                if (!ready)
                    return;
                // noinspection TypeScriptUnresolvedVariable,TypeScriptUnresolvedFunction
                this.widgetId = (<any>window).grecaptcha.render(this.targetRef.nativeElement, {
                    'sitekey': this.site_key,
                    'badge': this.badge,
                    'theme': this.theme,
                    'type': this.type,
                    'size': this.size,
                    'tabindex': this.tabindex,
                    'callback': <any>((response: any) => this._zone.run(this.recaptchaCallback.bind(this, response))),
                    'expired-callback': <any>(() => this._zone.run(this.recaptchaExpiredCallback.bind(this)))
                });
            });
    }

    // noinspection JSUnusedGlobalSymbols
    public reset() {
        if (this.widgetId === null)
            return;
        // noinspection TypeScriptUnresolvedVariable
        (<any>window).grecaptcha.reset(this.widgetId);
        this.onChange(null);
    }

    // noinspection JSUnusedGlobalSymbols
    public execute() {
        if (this.widgetId === null)
            return;
        // noinspection TypeScriptUnresolvedVariable
        (<any>window).grecaptcha.execute(this.widgetId);
    }

    public getResponse(): string {
        if (this.widgetId === null)
            return null;
        // noinspection TypeScriptUnresolvedVariable
        return (<any>window).grecaptcha.getResponse(this.widgetId);
    }

    writeValue(newValue: any): void {
        /* ignore it */
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    private recaptchaCallback(response: string) {
        this.onChange(response);
        this.onTouched();
        this.captchaResponse.emit(response);
    }

    private recaptchaExpiredCallback() {
        this.onChange(null);
        this.onTouched();
        this.captchaExpired.emit();
    }
}
