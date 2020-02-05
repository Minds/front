import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  Injector,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EmbedImage } from './plugins/embed-image.plugin';
import { EmbedVideo } from './plugins/embed-video.plugin';
import { MediumEditor } from 'medium-editor';
import { ButtonsPlugin } from './plugins/buttons.plugin';
import { AttachmentService } from '../../../services/attachment';
import { ConfigsService } from '../../services/configs.service';

export const MEDIUM_EDITOR_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InlineEditorComponent),
  multi: true,
};

@Component({
  moduleId: module.id,
  selector: 'm-inline-editor',
  template: `
    <div #host></div>
  `,
  host: {
    change: 'propagateChange($event.target.value)',
  },
  providers: [MEDIUM_EDITOR_VALUE_ACCESSOR],
})
export class InlineEditorComponent
  implements ControlValueAccessor, OnInit, OnDestroy, OnChanges {
  @Input() placeholder: string;
  el: ElementRef;
  editor: MediumEditor;
  @ViewChild('host', { static: true }) host: any;

  @Input() reset() {
    this.editor.setContent('');
    this.ngOnChanges('');
  }

  private buttons = new ButtonsPlugin({
    addons: {
      images: `<i class="material-icons">photo_camera</i>`,
      videos: `<i class="material-icons">play_arrow</i>`,
    },
    placeholder: 'Paste your link and then press Enter',
    uploadFunction: this.attachment.upload.bind(this.attachment),
  });
  private images = new EmbedImage(
    {
      buttonText: `<i class=\"material-icons\">photo_camera</i>`,
      placeholder: 'Type caption for image (optional)',
    },
    this.injector.get(ConfigsService)
  );
  private videos = new EmbedVideo({
    buttonText: `<i class="material-icons">play_arrow</i>`,
  });

  propagateChange = (_: any) => {};

  private first: boolean = true;

  constructor(
    el: ElementRef,
    private cd: ChangeDetectorRef,
    private attachment: AttachmentService,
    private injector: Injector
  ) {
    this.el = el;
  }

  ngOnInit() {
    let options = {
      toolbar: {
        buttons: [
          {
            name: 'bold',
            contentDefault: '<i class="material-icons">format_bold</i>',
          },
          {
            name: 'italic',
            contentDefault: '<i class="material-icons">format_italic</i>',
          },
          {
            name: 'underline',
            contentDefault: '<i class="material-icons">format_underlined</i>',
          },
          {
            name: 'strikethrough',
            contentDefault: '<i class="material-icons">strikethrough_s</i>',
          },
          {
            name: 'h2',
            contentDefault:
              '<b class="m-inline-editor--toolbar-text">H</b><sup>2</sup>',
          },
          {
            name: 'h3',
            contentDefault:
              '<b class="m-inline-editor--toolbar-text">H</b><sup>3</sup>',
          },
          {
            name: 'removeFormat',
            contentDefault: '<i class="material-icons">format_clear</i>',
          },
          {
            name: 'justifyLeft',
            contentDefault: '<i class="material-icons">format_align_left</i>',
          },
          {
            name: 'justifyCenter',
            contentDefault: '<i class="material-icons">format_align_center</i>',
          },
          {
            name: 'justifyRight',
            contentDefault: '<i class="material-icons">format_align_right</i>',
          },
          {
            name: 'anchor',
            contentDefault: '<i class="material-icons">insert_link</i>',
          },
          {
            name: 'justifyFull',
            contentDefault:
              '<i class="material-icons">format_align_justify</i>',
          },
          {
            name: 'quote',
            contentDefault: '<i class="material-icons">format_quote</i>',
          },
        ],
      },
      extensions: {
        buttonsPlugin: this.buttons,
        embedImage: this.images,
        embedVideo: this.videos,
      },
    };

    if (this.placeholder) {
      Object.assign(options, {
        placeholder: {
          text: this.placeholder,
          hidOnClick: true,
        },
      });
    }

    this.editor = new MediumEditor(this.host.nativeElement, options);
    this.host.nativeElement.focus();
    this.editor.subscribe('editableInput', (event: any, editable: any) => {
      let value = (<any>this.editor).elements[0].innerHTML;
      this.ngOnChanges(value);
    });
  }

  prepareForSave(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.buttons.prepare();
      this.images.prepare();
      this.videos.prepare();
      this.propagateChange((<any>this.editor).elements[0].innerHTML);
      setTimeout(() => {
        resolve();
      });
    });
  }

  ngOnDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  ngOnChanges(changes: any) {
    this.propagateChange(changes);
  }

  writeValue(value: any) {
    if (this.editor) {
      if (value && value !== '') {
        this.editor.setContent(value);
      }
      if (this.first) {
        const p = this.el.nativeElement.querySelector(
          '.medium-editor-element p'
        );
        if (p) p.click();
        this.first = false;
      }
    }
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any) {}
}
