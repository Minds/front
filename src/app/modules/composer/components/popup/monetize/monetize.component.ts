import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { ComposerService } from '../../../services/composer.service';
import { UniqueId } from '../../../../../helpers/unique-id.helper';
import { ComposerBlogsService } from '../../../services/blogs.service';

@Component({
  selector: 'm-composer__monetize',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'monetize.component.html',
})
export class MonetizeComponent implements OnInit {
  @Output() dismissIntent: EventEmitter<any> = new EventEmitter<any>();

  /**
   * ID for input/label relationships
   */
  readonly inputId: string = UniqueId.generate('m-composer__tags');

  state: { enabled: boolean; type: string; amount: number } = {
    enabled: false,
    type: 'tokens',
    amount: 0,
  };

  constructor(
    protected service: ComposerService,
    protected blogsService: ComposerBlogsService
  ) {}

  ngOnInit(): void {
    const monetization = this.getComposerService().monetization$.getValue();

    this.state = {
      enabled: Boolean(monetization),
      type: (monetization && monetization.type) || 'tokens',
      amount: (monetization && monetization.min) || 0,
    };
  }

  save() {
    this.getComposerService().monetization$.next(
      this.state.enabled
        ? {
            type: this.state.type,
            min: this.state.amount,
          }
        : null
    );
    this.dismissIntent.emit();
  }

  /**
   * Returns either the ComposerService or BlogService depending on the contentType$.
   * @returns { ComposerService | BlogService } - service to handle state.
   */
  getComposerService(): ComposerService | ComposerBlogsService {
    return this.service.contentType$.getValue() === 'post'
      ? this.service
      : this.blogsService;
  }
}
